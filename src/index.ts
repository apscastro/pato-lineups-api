import AppDataSource from "./data-source";
import App from "./App";

const PORT = 8090;

AppDataSource.initialize().then(async () =>{
    const app = App();
    app.listen(PORT, () =>{
        console.log(`Server running on port ${PORT}`);
    })
}).catch((err) =>{
    console.log(err.stack);
})