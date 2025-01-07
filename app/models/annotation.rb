class Annotation < ApplicationRecord
  belongs_to :project
  belongs_to :page, optional: true
  belongs_to :user
end
