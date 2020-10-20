document.getElementById("connectingBtn").addEventListener("click", ()=>
{
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = ()=>
    {
        if (xhr.readyState === 4)
        {
            if (JSON.parse(xhr.responseText).userId !== -1)
            {
                localStorage.setItem("userId", JSON.parse(xhr.responseText).userId);
                window.location.replace("/user");
            }
            else
            {
                document.getElementById("msgBrd").innerHTML="User not registered";
            }
        }
    };
    let userName =  document.getElementById("userInput").value;
    xhr.open('POST', '/');
    xhr.setRequestHeader("userName", userName);
    xhr.send();
})

document.getElementById("signingBtn").addEventListener("click", ()=>
{
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = ()=>
    {
        if (xhr.readyState === 4)
        {
            if (JSON.parse(xhr.responseText).userId !== -1)
            {
                localStorage.setItem("userId", JSON.parse(xhr.responseText).userId);
                window.location.replace("/user");
            }
            else
            {
                document.getElementById("msgBrd").innerHTML="User name is taken";
            }
        }
    };
    let userName = document.getElementById("userInput").value;
    xhr.open('POST', '/user/newUser');
    xhr.setRequestHeader("userName", userName);
    xhr.send({userName : userName});
})
