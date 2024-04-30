export {paramsSchema, logout}

const paramsSchema = {}

function logout(req: any, res: any) {
    req.session.destroy((err: any) => {
        if (err) {
            console.error("Error destroying session:", err)
            return res.status(500).send("Error destroying session")
        }
        res.status(200).send()
    })
}