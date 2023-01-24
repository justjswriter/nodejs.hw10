const carsContainer = document.querySelector("#cars_container");
const usersContainer = document.querySelector("#users_container");
const ownerLists = document.querySelector("#owner_lists")
const carName = document.querySelector("#car_name")
const modal = document.querySelector("#modal")
const cancelChange = document.querySelector("#cancel_change")
const changeOwnerBtn = document.querySelector("#change_owner_btn")

const BASE_URL = "http://localhost:8080";
let newOwnercarId = ''

const fetchData = async (route) => {
    const response = await fetch(BASE_URL + route);
    return await response.json();
};

const postData = async (route, payload) => {
    fetch(
        BASE_URL + route, 
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: payload,
        },
    )
    .then(() => alert("OK"))
    .catch(() => alert("Error sending request"));
};

const drawCars = async () => {
    const cars = await fetchData("/cars");

    carsContainer.innerHTML = "";

    for (const car of cars) {
        carsContainer.innerHTML += `
            <div class="car_item">
                <p>Model: ${car.model}</p>
                <p>Color: ${car.color}</p>
                <p>Year: ${car.year}</p>
                <p>Current owner: ${car.owner?.fullName || ''}</p>
                <button onclick="openChangeModal('${car._id}')">Change user</button>
                <p>Owners history:</p> 
                ${car.ownersHistory.map(item => `<li>${item.fullName}</li>`).join('')} 
            </div>
            <hr>
        `;
    }
}

const drawUsers = async () =>{
    const users = await fetchData("/users")
    console.log(users)
    for(const user of users){
        usersContainer.innerHTML += `
            <div class="user_item">
                <p>User name: ${user.fullName}</p>
        `
    }

}

const openChangeModal = async (carId)=> {
    ownerLists.innerHTML = ""
    const users = await fetchData("/users")
    const carData = await fetchData(`/cars/yourcar/${carId}`)
    carName.textContent = await carData[0].model
    carName.dataset.id = await carData[0]._id
    filteredUsers = users.filter((user) => user._id !== carData[0].owner._id)
    for(const user of filteredUsers){
        ownerLists.innerHTML +=`
            <option value="${user._id}">${user.fullName}</option>
        `
    }
    newOwnercarId = carId
    openModal()
}

const changeUser = async ()=>{
    let newOwnerId = ownerLists.value
    const payload = {
        newOwnerId: newOwnerId,
        carId: newOwnercarId
    }
    const jsonPayload = JSON.stringify(payload)
    await postData("/cars/changeOwner", jsonPayload)
    closeModal()
    setTimeout(()=> drawCars, 1000)
}


const openModal = () =>{
    modal.style.display = "block"
}

const closeModal = () =>{
    modal.style.display = "none"
}

changeOwnerBtn.addEventListener("click", changeUser)
cancelChange.addEventListener("click", closeModal)
drawUsers();
drawCars();