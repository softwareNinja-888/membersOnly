const pool = require('./pool')

async function addUser(formData){
	const memberStatus = formData.type === 'member' ? true : false; 
	const adminStatus = formData.type === 'member' ? false : true; 

	console.log('memberStatus:',memberStatus)
	console.log('adminStatus:',adminStatus)


	try{
		await pool.query("INSERT INTO users (first_name,last_name,email,password_hash,is_member,is_admin) VALUES ($1,$2,$3,$4,$5,$6)",[
			formData.firstName,
			formData.lastName,
			formData.email,
			formData.password,
			memberStatus,
			adminStatus
		])
	} catch(err){
		console.log('Failed inserting into database:',err)
	}
}

// async function getUserId(id){
// 	try{
// 	} catch(err){
// 		console.log('Failed fetching at database:',err)
// 	}
// }

// async function createUser(username,hash,salt,isAdmin=false){
// 	try{
// 	} catch(err){
// 		console.log('Failed inserting into the database:',err)
// 	}
// }

module.exports={
	addUser
}