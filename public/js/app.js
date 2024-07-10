class User {
  constructor(id, name, city, phone) {
    this.id = id;
    this.name = name;
    this.city = city;
    this.phone = phone;
  }
}

class UserController {
  constructor() {
    this.apiEndpoint = "https://jsonplaceholder.typicode.com/users";
    this.userList = [];
    this.initialize();
  }

  async initialize() {
    await this.fetchUsers();
    this.renderUsers();
    this.setupEventListeners();
  }

  async fetchUsers() {
    try {
      const response = await fetch(this.apiEndpoint);
      if (!response.ok) throw new Error("Failed to load users");
      const usersData = await response.json();
      console.log(usersData); // Imprime los datos en la consola
      this.userList = usersData.map(
        (user) => new User(user.id, user.name, user.address.city, user.phone)
      );
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  renderUsers() {
    const tableBody = document.querySelector("#usersTable tbody");
    tableBody.innerHTML = "";
    this.userList.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.city}</td>
            `;
      tableBody.appendChild(row);
    });
  }

  async getUserById(id) {
    try {
      const response = await fetch(`${this.apiEndpoint}/${id}`);
      if (!response.ok) throw new Error("User not found");
      const userData = await response.json();
      return new User(
        userData.id,
        userData.name,
        userData.address.city,
        userData.phone
      );
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  async displayUserInfo(id) {
    const user = await this.getUserById(id);
    const userInfoDiv = document.getElementById("userInfo");
    if (user) {
      userInfoDiv.innerHTML = `
                <h2>User Information</h2>
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Phone:</strong> ${user.phone}</p>
            `;
    } else {
      userInfoDiv.innerHTML = "<p>User not found</p>";
    }
  }

  setupEventListeners() {
    document.getElementById("userForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const userId = document.getElementById("userId").value;
      if (userId) {
        this.displayUserInfo(userId);
      } else {
        alert("Please enter a user ID.");
      }
    });
  }
}

new UserController();
