<div class="container flex flex-col gap-2">
  <h2 class="text-3xl">About this project</h2>

  <div class="flex flex-col lg:flex-row gap-4">
    <div class="flex flex-col gap-2">
      <p>
        This project is a complete ground-up rewrite of the popular website
        <a href="https://wheelofnames.com" target="_blank">wheelofnames.com</a>
        using a vastly different technology stack.
      </p>

      <p>
        Large portions of the core Wheel of Names code were written over half a
        decade ago by various developers, and thus maintaining it has become
        difficult due to the sheer amount of technical debt that has accumulated
        over the years.
      </p>

      <p>
        The goal of this rewrite is to showcase the technical improvements that
        can be made by using newer technologies, and hopefully uncover some
        improvements that can be dropped into the original website as well.
      </p>
    </div>

    <span class="hidden lg:block divider-vertical" />

    <table class="text-left min-w-fit">
      <thead>
        <tr>
          <th scope="col">Feature</th>
          <th scope="col">Wheel of Names</th>
          <th scope="col">Svelte Wheel</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Language</th>
          <td>Javascript</td>
          <td>Typescript</td>
        </tr>
        <tr>
          <th scope="row">Framework</th>
          <td>Vue + Quasar</td>
          <td>Svelte + SvelteKit</td>
        </tr>
        <tr>
          <th scope="row">Compiler</th>
          <td>Webpack + Quasar</td>
          <td>Vite + Svelte</td>
        </tr>
        <tr>
          <th scope="row">Components</th>
          <td>Quasar + custom</td>
          <td>Skeleton UI + custom</td>
        </tr>
        <tr>
          <th scope="row">Styling</th>
          <td>Quasar + CSS</td>
          <td>TailwindCSS + PostCSS</td>
        </tr>
        <tr>
          <th scope="row">Backend</th>
          <td>Express</td>
          <td>SvelteKit</td>
        </tr>
        <tr>
          <th scope="row">Testing</th>
          <td>Jest + Cypress</td>
          <td>Vitest + Playwright</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<style lang="postcss">
  th, td {
    padding: 0 0.5rem;
  }
  th:first-child {
    padding-left: 0;
  }
</style>
