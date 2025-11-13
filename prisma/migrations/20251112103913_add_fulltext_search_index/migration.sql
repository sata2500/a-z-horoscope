-- Create a GIN index on the title and content columns of the journal_entries table
CREATE INDEX journal_entries_search_idx ON "journal_entries" USING GIN (to_tsvector('english', "title" || ' ' || "content"));
