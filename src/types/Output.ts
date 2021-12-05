
export default interface Output {
    compile_output: null
    memory: number
    message: string | null
    status: {id: number, description: string}
    stderr: string | null
    stdout: string | null
    time: string | null
}
