



(function () {
    'use strict'
    const forms = document.querySelectorAll('.requires-validation')
    Array.from(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
    
          form.classList.add('was-validated')
        }, false)
      })
    })()



    async function adduser(event){
      event.preventDefault();
      console.log('reached here')


      let name = document.getElementById('name').value;
      console.log('name : ',name)

      let email  = document.getElementById('email').value;
      console.log('email :',email);

      let phone = document.getElementById('phone').value;
      console.log('Mobile-Number : ',phone);

      let password = document.getElementById('password').value;
      console.log('password : ',password);

      let datas = {
        name,
        email,
        phone,
        password
      }
      console.log('datas : ',datas)

      let json_datas = JSON.stringify(datas);
      console.log('json_Datas',json_datas);

      let response = await fetch('/submit',{
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : json_datas,
      });
      console.log('response',response)
      alert('User created succsefully');
    }
    
async function viewdata(){
  try {
    let response = await fetch('/submit')
    console.log('fetched',response);

    let parsed_datas = await response.json();
    console.log("parsed_datas",parsed_datas);

    let user_container = document.getElementById('user-container')

    let rows = '';

    for(i=0; i<parsed_datas.length;i++){
      rows += `
      <tr class="tab">
      <td><i class="fa fa-user-o px-3 "style="font-size:25px;"></i></td>
      <td>${parsed_datas[i].name}</td>
      <td>${parsed_datas[i].email}</td>
      <td>${parsed_datas[i].phone}</td>
      <td>${parsed_datas[i].password}</td>
      <td><i class="fa fa-eye" onclick = "handleclicked('${parsed_datas[i]._id}')"></i> </td>
      <td><i class="fa fa-trash-o" onclick = "delClicked('${parsed_datas[i]._id}')" style="font-size:25px; color:red;"></i></td>
      </tr>
      `
      // console.log('parsed_datas(id)',parsed_datas[i]._id)
      
    }
    user_container.innerHTML = rows;

  } catch (error) {
    console.log("error",error)
  }

  
}

function handleclicked(id){
 console.log("id from handle click",id)
 window.location = `get-single.html?id=${id}`;
}

async function singleview(){
  let params = new URLSearchParams(window.location.search);
  let id = params.get('id');
  console.log('id',id);
  

  try {
    let response = await fetch(`/user?id=${id}`);
    let user = await response.json();
    console.log("user details",user)

    let single_Container = document.getElementById('single-container');

    rows ='';
    rows = `
    <div>${user.name}</div>
    <div>${user.email}</div>
    <div>${user.phone}</div>
    <div>${user.password}</div>
    <div><button data-user='${user}' onclick = "userupdate('${user._id}',this)">update your profile</button>




    `
    single_Container.innerHTML = rows
  } catch (error) {
    console.log("error",error)
  }
}


async function delClicked(id) {
  console.log("del-clicked");
  
  try {
    let response = await fetch(`/del?id=${id}`, { method: 'DELETE' });
    console.log('fetched', response);
    let parsed_response = await response.json();
    console.log("parsed_response", parsed_response);
    viewdata();
    alert('Profile deleted')
  } catch (error) {
    console.log("error", error);
    alert("something went wrong")
  }
}

function userupdate(id){
  window.location  = `update.html?id=${id}`;
}

 async function update(){
 
  let location = window.location
  let querystring = location.search
  let url_params = new URLSearchParams(querystring);


  let id = url_params.get('id');
  console.log('id from update',id);

  try {
    let response = await fetch(`/user?id=${id}`);
    let user = await response.json();


    console.log("user details form update",user)


    let name  = document.getElementById('name');
    name.value = user.name;


    let email = document.getElementById('email');
    email.value = user.email;


    let phone = document.getElementById('phone');
    phone.value = user.phone;


    let password = document.getElementById('password');
    password.value = user.password;


    
    
  } catch (error) {
    console.log("error",error)
  }


}
 async function editedData(event){

  event.preventDefault();
  console.log("reached from edited data")

  console.log("register btn cllicked...");

  let location = window.location
  console.log("location : ",location);

  let querystring = location.search
  console.log("querystring : ",querystring);

  let url_params = new URLSearchParams(querystring);
  console.log("url_params : ",url_params);

  let id = url_params.get('id');
  console.log('id from update',id);

  let name = document.getElementById('name').value;
  console.log('edited name',name);

  let email = document.getElementById('email').value;
  console.log('edited email',email)

  let phone = document.getElementById('phone').value;
  console.log('edited phone',phone)

  let password  = document.getElementById('password').value
  console.log("edited password",password)

  let edited_data = {
    name,
    email,
    phone,
    password
  };
  console.log("edited_datas",edited_data);

  let stringified_edited_data =  JSON.stringify(edited_data)

  try {
    let response = await fetch(`/users?id=${id}`,{
      method : 'PUT',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : stringified_edited_data,

    });
    alert("updated successfully");
  } catch (error) {
    console.error("something went wrong",error)
  }

}
