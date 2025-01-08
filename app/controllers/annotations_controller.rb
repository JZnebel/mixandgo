class AnnotationsController < ApplicationController
  before_action :set_project, only: %i[mark_up_project mark_up_page create save_canvas]
  before_action :set_page, only: %i[mark_up_page]
  before_action :authenticate_user!, only: [:create, :destroy, :save_canvas]

  # Display project-level mark-up
  def mark_up_project
    @annotations = @project.annotations
  end

  # Display page-level mark-up
  def mark_up_page
    @annotations = @page.annotations
  end

  # Create a new annotation
  def create
    @annotation = current_user.annotations.new(annotation_params)
    @annotation.project_id = params[:annotation][:project_id]
    if @annotation.save
      render json: @annotation, status: :created
    else
      Rails.logger.error("create - Validation failed: #{@annotation.errors.full_messages}")
      render json: @annotation.errors, status: :unprocessable_entity
    end
  end

  # Delete an annotation
  def destroy
    @annotation = current_user.annotations.find(params[:id])
    if @annotation.destroy
      head :no_content
    else
      render json: { error: "Failed to delete annotation" }, status: :unprocessable_entity
    end
  end

  # Save the canvas image to the server
  def save_canvas
    base64_data = params[:image]
    filename = params[:filename]
    project_id = params[:project_id]

    unless project_id.present?
      Rails.logger.error("save_canvas - Missing project_id in params")
      render json: { success: false, error: "Missing project_id" }, status: :bad_request
      return
    end

    begin
      image_data = Base64.decode64(base64_data)

      project_folder = Rails.root.join("public", "projects", project_id.to_s)
      FileUtils.mkdir_p(project_folder)

      file_path = project_folder.join(filename)
      File.open(file_path, "wb") { |file| file.write(image_data) }

      render json: { success: true, file_path: file_path.to_s }
    rescue => e
      Rails.logger.error("save_canvas - Error: #{e.message}")
      render json: { success: false, error: e.message }, status: :unprocessable_entity
    end
  end

  private

  # Set the project for mark-up actions
  def set_project
    project_id = params[:project_id] || params[:id]
    Rails.logger.info("set_project - Looking for project with ID: #{project_id}")

    if project_id.blank?
      Rails.logger.error("set_project - Missing project_id or id")
      render json: { error: "Missing project_id or id" }, status: :bad_request
      return
    end

    @project = current_user.projects.find_by(id: project_id)
    unless @project
      Rails.logger.error("set_project - Project not found for ID: #{project_id}")
      render json: { error: "Project not found" }, status: :not_found
    end
  end

  # Set the page for mark-up actions (optional)
  def set_page
    @page = @project.pages.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    Rails.logger.error("set_page - Page not found for ID: #{params[:id]}")
    render json: { error: "Page not found" }, status: :not_found
  end

  # Strong parameters for annotations
  def annotation_params
    params.require(:annotation).permit(:content, :x_position, :y_position, :annotation_type, :project_id, :page_id)
  end
end
