class PagesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_project
  before_action :set_page, only: [:edit, :update, :destroy]

  
  def new
    @page = @project.pages.new
  end

  def create
    @page = @project.pages.new(page_params)
    if @page.save
      generate_screenshot(@page)
      redirect_to @project, notice: "Page was successfully added."
    else
      render :new
    end
  end

  def edit
  end

  def update
    if @page.update(page_params)
      generate_screenshot(@page)
      redirect_to @project, notice: "Page was successfully updated."
    else
      render :edit
    end
  end

  def destroy
    @page = Page.find(params[:id]) 
    @project = @page.project       
    @page.destroy                  
  
    respond_to do |format|
      format.html { redirect_to @project, notice: "Page was successfully deleted." }
      format.json { head :no_content }
    end
  end

  private

  def set_project
    @project = current_user.projects.find(params[:project_id])
  end

  def set_page
    @page = @project.pages.find(params[:id])
  end

  def page_params
    params.require(:page).permit(:url)
  end

  def generate_screenshot(page)
    output_file = Rails.root.join("public", "screenshots", "#{page.id}.png")
    system("node", Rails.root.join("screenshot.js").to_s, page.url, output_file.to_s)
    page.update!(screenshot: "/screenshots/#{page.id}.png")
  rescue => e
    Rails.logger.error("Screenshot generation failed for page #{page.id}: #{e.message}")
  end
end
