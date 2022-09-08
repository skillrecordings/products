Dynamic image generator for typescriptcourse.com. Good for share cards.

## Develop

- run `vercel dev`
- visit `http://localhost:3000/api/card`

## Usage

```js
queryString.stringifyUrl({
    url: 'https://protailwind-images.vercel.app/api/card',
    query: {
     title,
     // TODO: image
    }
```

## Example

<img src="https://protailwind-images.vercel.app/api/card?title=Autocomplete%20suggestions%20and%20error%20messages%20with%20lightweight%20TypeScript" width="500" />
