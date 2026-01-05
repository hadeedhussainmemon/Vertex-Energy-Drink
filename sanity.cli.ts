import { defineCliConfig } from 'sanity/cli'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { projectId, dataset } from './src/sanity/env'

export default defineCliConfig({
    api: {
        projectId,
        dataset,
    },
    autoUpdates: true,
    studioHost: 'vertex-energy',
})
