# file-analytics

File Analytics is a custom GitHub Action designed to analyze a set of files specified by a blob pattern. This action takes a multiline input of file patterns (including wildcards) and returns size, modification date and other metadata of each matched file. It is particularly useful for workflows that need to gather metadata about files in a repository.

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
