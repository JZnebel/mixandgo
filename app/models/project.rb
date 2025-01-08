class Project < ApplicationRecord
  belongs_to :user
  has_many :pages, dependent: :destroy
  has_many :annotations, dependent: :destroy

  # Validate presence and stricter URL format
  validates :url, presence: true,
                  format: { 
                    with: /\Ahttps?:\/\/[\S]+\.[\S]+\z/, 
                    message: "must be a valid URL with a proper domain (e.g., https://example.com)" 
                  }

  # Validate presence of title
  validates :title, presence: true
end
