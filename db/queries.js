const pool = require('./pool')

async function addUser(formData){
	// const memberStatus = formData.type === 'member' ? true : false; 
	// const adminStatus = formData.type === 'member' ? false : true; 

	const memberStatus =  false; 
	const adminStatus = false; 
	console.log('memberStatus:',memberStatus)
	console.log('adminStatus:',adminStatus)


	try{
		await pool.query("INSERT INTO users (first_name,last_name,email,password_hash,is_member,is_admin) VALUES ($1,$2,$3,$4,$5,$6)",[
			formData.firstName,
			formData.lastName,
			formData.email,
			formData.pw,
			memberStatus,
			adminStatus
		])
	} catch(err){
		console.log('Failed inserting into database:',err)
	}
}

async function getHash(name){
	try{
		const {rows} = await pool.query("SELECT * FROM membership_codes WHERE name = $1",[name])
		return rows[0]
	} catch(err){
		console.log('Failed fetching at hash of membership codes:',err)
	}
}
async function getUser(email){
	try{
		const {rows} = await pool.query("SELECT * FROM users WHERE email = $1", [email])
		return rows[0]
	} catch(err){
		console.log('Failed fetching at database:',err)
	}
}


async function getUserId(id){
	try{
		const {rows} = await pool.query("SELECT * FROM users WHERE id = $1", [id])
		return rows[0]
	} catch(err){
		console.log('Failed fetching at database:',err)
	}
}

async function InsertMembership(data){
	try{
		await pool.query(
		  'INSERT INTO membership_codes (name,hashed_code, description, usage_limit) VALUES ($1, $2, $3, $4)',
		  [data.name,data.hashedCode, data.description, data.usage]
		);
	} catch(err){
		console.log('Err inserting membership',err)
		return err
	}
}


async function createUser(username,hash,salt,isAdmin=false){
	try{
	} catch(err){
		console.log('Failed inserting into the database:',err)
	}
}

async function setUserAsMember(userId,codeId) {
	try{
		await pool.query('UPDATE users SET is_member = true WHERE id = $1', [userId])
		await pool.query('UPDATE membership_codes SET usage_count = usage_count + 1 WHERE id = $1', [codeId])
	}catch(err){
		console.log('Couldnt set user as member')
		return err
	}
}

async function incrementCodeUsage(codeId) {
	try{
		await pool.query('UPDATE membership_codes SET usage_count = usage_count + 1 WHERE id = $1', [codeId])
	}catch(err){
		console.log('Couldnt increment code usage')
		return err
	}
}

// async function createUser(username,hash,salt,isAdmin=false){
// 	try{
// 	} catch(err){
// 		console.log('Failed inserting into the database:',err)
// 	}
// }

module.exports={
	addUser,
	getUser,
	getUserId,
	getHash,
	InsertMembership,
	setUserAsMember,
	incrementCodeUsage,
}