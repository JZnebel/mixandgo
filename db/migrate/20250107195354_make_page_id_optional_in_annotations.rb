class MakePageIdOptionalInAnnotations < ActiveRecord::Migration[8.0]
  def change
    change_column_null :annotations, :page_id, true
  end
end
