// Runs each named block in isolation: a throw (or rejected promise) in one block
// is logged and doesn't stop the others — same as separate <script> tags behaved.
export function runBlocks(scope, blocks) {
    Object.entries(blocks).forEach(([name, block]) => {
        try {
            Promise.resolve(block()).catch((err) => console.warn(`[${scope}] ${name} failed:`, err));
        } catch (err) {
            console.warn(`[${scope}] ${name} failed:`, err);
        }
    });
}
