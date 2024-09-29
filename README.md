# file-analytics

File Analytics is a custom GitHub Action designed to analyze a set of files specified by a blob pattern. This action takes a multiline input of file patterns (including wildcards) and returns size, modification date and other metadata of each matched file. It is particularly useful for workflows that need to gather metadata about files in a repository.

## Example usage in Actions

<details>
  <summary>Show file metadata in a run summary</summary>
  
```YAML
name: File Test
on:
  workflow_dispatch:
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
            ref: main
            # git-restore-mtime-bare uses the ref log to find the correct timestamp
            # for each file. This requires a full git history. The default value (1)
            # creates a shallow checkout.
            fetch-depth: 0
      
      - name: Restore timestamps
        uses: chetan/git-restore-mtime-action@v2

      - name: Run File Analytics action
        id: analytics_run
        uses: FranciscoKnebel/file-analytics@0.1.1
        with:
          files: "sample/**/*"
          output_json: file_info.json
      
      - name: Generate Markdown table
        id: create_table
        uses: gazab/create-markdown-table@v1
        with:
          file: file_info.json
          columns: '["file", "size", "ext", "mtime"]'

      - name: Output Markdown to Action Summary
        run: |
          echo "             
            ${{ steps.create_table.outputs.table }}
          " >> $GITHUB_STEP_SUMMARY
```
</details>

<details>
  <summary>Update README.md with repository metadata and add a commit</summary>
  
```YAML
name: File Test
on:
  workflow_dispatch:
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
            ref: main
            # git-restore-mtime-bare uses the ref log to find the correct timestamp
            # for each file. This requires a full git history. The default value (1)
            # creates a shallow checkout.
            fetch-depth: 0
      
      - name: Restore timestamps
        uses: chetan/git-restore-mtime-action@v2

      - name: Run File Analytics action
        id: analytics_run
        uses: FranciscoKnebel/file-analytics@0.1.1
        with:
          files: "sample/**/*"

      - name: Output Markdown to README file
        run: |
          echo "
            ## Dawntech Assets

            - 📁 Arquivos: ${{ steps.analytics_run.outputs.file_count }}
            - ⚖️ Tamanho: ${{ steps.analytics_run.outputs.file_size }}
              
            ${{ steps.create_table.outputs.table }}
          " > README.md
      
      - uses: EndBug/add-and-commit@v9
        with:
          default_author: github_actions
          add: 'README.md'
          message: "Update file stats in README.md"
```
</details>

### Action Inputs

- **files**: File pattern to get metadata from. Comma-separated glob string list. **Required**. Example usage:
  - `"sample/1.txt"`
  - `"sample/1.png,sample/2.txt"`
  - `"sample/subdirectory/**/*"`
- _follow-symbolic-links_: Indicates whether to follow symbolic links. Defaults to true.
- _output_json_: Indicates to save the metadata as JSON to this file. Optional.

### Action Outputs

- file_output: File metadata in JSON format
- file_info: File metadata in text format
- file_size: Total file size
- file_count: Total file count

## Development

### Requirements

- Node

```
npm install
```

### Test execution

Actions inputs require prefixing environment variables with `INPUT_`, so the `FILES` input will come from a `INPUT_FILES` variable.

```
INPUT_FILES="test/**/*.*" node index.js
```
