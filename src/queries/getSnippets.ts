import axios from "axios";

export default async function getSnippets() {
    const { data } = await axios.get("http://localhost:8080/");
    return data;
}
