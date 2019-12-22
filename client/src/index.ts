export function performRequestAndLogResult() {
    console.log("we woo wee woo");
    const req = new XMLHttpRequest();
    req.open("GET", "/request", true);
    req.onload = () => {
        console.log(req.responseText);
    };
    req.send();
}

document.getElementById("theButton")?.addEventListener("click", performRequestAndLogResult);