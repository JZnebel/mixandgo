Rails.application.routes.draw do
  devise_for :users

  # Annotations routes
  resources :annotations, only: [:create, :destroy]

  # Projects and nested pages routes
  resources :projects do
    member do
      get 'mark_up', to: 'annotations#mark_up_project'
    end

    resources :pages do
      member do
        get 'mark_up', to: 'annotations#mark_up_page'
      end
    end
  end

  # Route for saving canvas images
  post "/save_canvas", to: "annotations#save_canvas"

  # Health check route
  get "up" => "rails/health#show", as: :rails_health_check

  # Root path points to ProjectsController#index
  root to: "projects#index"
end