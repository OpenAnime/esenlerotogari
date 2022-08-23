import adapter from '@sveltejs/adapter-auto'

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        package: {
            dir: 'esenlerotogari',
        },
        alias: {
            $lib: 'src/lib',
        },
        adapter: adapter(),
    },
}

export default config
