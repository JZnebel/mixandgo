class CreatePages < ActiveRecord::Migration[8.0]
  def change
    create_table :pages do |t|
      t.string :url
      t.string :screenshot
      t.references :project, null: false, foreign_key: true

      t.timestamps
    end
  end
end
