export const windows = new Set()

export function fixPosition () {
  windows.forEach(w => {
    w.fixPosition()
  })
}