require("dotenv").config()
const bcrypt = require('bcrypt');
const db = require('./queries')
const adminPass = process.env.ADMIN_CODE;
const memberPass = process.env.MEMBER_CODE;


async function main() {
    const hashedCodeAdmin = await bcrypt.hash(adminPass, 12);
    const hashedCodeMember = await bcrypt.hash(memberPass, 12);


    const dataAdmin = {
      name:'Admin',
      hashedCode:hashedCodeAdmin,
      description: 'Gives user admin rights',
      usage:5
    }

    // ONLY 150 MEMBERS CAN EXIST IN MY CLUB
    const dataMember = {
      name:'Member',
      hashedCode:hashedCodeMember,
      description: 'Gives user membership rights',
      usage:150
    }

    await db.InsertMembership(dataAdmin)
    await db.InsertMembership(dataMember)
}
main()