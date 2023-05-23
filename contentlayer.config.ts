import { defineDocumentType, makeSource } from '@contentlayer/source-files'
import highlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import rehypeAutolinkHeadings from "@justfork/rehype-autolink-headings"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"

export const Post = defineDocumentType(() => ({
    name: 'Post',
    filePathPattern: `blog/**/*.mdx`,
    contentType: 'mdx',
    fields: {
        title: { type: 'string', required: true },
        description: { type: 'string', required: false},
        date: { type: 'date', required: true },
        tags: { type: 'string', required: false },
        published: { type: "boolean", default: true},
    },
    computedFields: {
        url: {
            type: "string",
            resolve: (doc: any) => `/blog/${doc._raw.flattenedPath.split("/").slice(1).join("/")}`,
        },
        slugAsParams: {
            type: "string",
            resolve: (doc: any) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
        },
    }
}))

export const Project = defineDocumentType(() => ({
    name: 'Project',
    filePathPattern: `projects/**/*.mdx`,
    contentType: 'mdx',
    fields: {
        title: { type: 'string', required: true },
        description: { type: 'string', required: false},
        date: { type: 'date', required: true },
        tags: { type: 'string', required: false },
        published: { type: "boolean", default: true},
    },
    computedFields: {
        url: {
            type: "string",
            resolve: (doc: any) => `/projects/${doc._raw.flattenedPath.split("/").slice(1).join("/")}`,
        },
        slugAsParams: {
            type: "string",
            resolve: (doc: any) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
        },
    }
}))

export default makeSource({
    contentDirPath: './content',
    documentTypes: [Post, Project],
    mdx: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
            rehypeSlug,
            [
                rehypePrettyCode,
                {
                    theme: "github-dark",
                    // TODO Figure out node type
                    onVisitLine(node : any) {
                        // Prevent lines from collapsing in `display: grid` mode, and allow empty
                        // lines to be copy/pasted
                        if (node.children.length === 0) {
                            node.children = [{ type: "text", value: " " }]
                        }
                    },
                    onVisitHighlightedLine(node :any ) {
                        node.properties.className.push("line--highlighted")
                    },
                    onVisitHighlightedWord(node :any ) {
                        node.properties.className = ["word--highlighted"]
                    },
                },
            ],
            [
                rehypeAutolinkHeadings,
                {
                    properties: {
                        className: ["subheading-anchor"],
                        ariaLabel: "Link to section",
                    },
                },
            ],
        ],
    },

})