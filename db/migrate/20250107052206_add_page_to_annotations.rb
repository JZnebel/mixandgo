class AddPageToAnnotations < ActiveRecord::Migration[8.0]
  def change
    add_reference :annotations, :page, null: false, foreign_key: true
  end
end
