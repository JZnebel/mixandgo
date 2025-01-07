class Project < ApplicationRecord
  belongs_to :user
  has_many :pages, dependent: :destroy
  has_many :annotations, dependent: :destroy
end
