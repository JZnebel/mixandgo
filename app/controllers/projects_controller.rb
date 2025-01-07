class ProjectsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_project, only: %i[show edit update destroy]

  def index
    @projects = current_user.projects.order(created_at: :desc)
  end

  def show
    @project = current_user.projects.find(params[:id])
    @pages = @project.pages
  end
  

  def new
    @project = current_user.projects.new
  end

  def edit
  end

  def create
    @project = current_user.projects.new(project_params) 

    respond_to do |format|
      if @project.save
        generate_screenshot(@project)
        format.html { redirect_to @project, notice: "Project was successfully created." }
        format.json { render :show, status: :created, location: @project }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @project.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @project.update(project_params)
        if @project.previous_changes.key?("url")
          generate_screenshot(@project)
        end
        format.html { redirect_to @project, notice: "Project was successfully updated." }
        format.json { render :show, status: :ok, location: @project }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @project.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @project.destroy

    respond_to do |format|
      format.html { redirect_to projects_path, status: :see_other, notice: "Project was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  def set_project
    @project = current_user.projects.find(params[:id])
  end

  def project_params
    params.require(:project).permit(:title, :url, :screenshot)
  end

  def generate_screenshot(project)
    timestamp = Time.now.to_i
    filename = "#{project.id}_#{timestamp}.png"
  
    output_file = Rails.root.join("public", "screenshots", filename)
    system("node", Rails.root.join("screenshot.js").to_s, project.url, output_file.to_s)
  
    project.update!(screenshot: "/screenshots/#{filename}")
  rescue => e
    Rails.logger.error("Screenshot generation failed for project #{project.id}: #{e.message}")
  end
  
end
