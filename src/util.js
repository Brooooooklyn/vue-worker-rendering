export function fetchCommits(sha) {
  return fetch(`https://api.github.com/repos/vuejs/vue/commits?per_page=100&sha=${sha}`)
}