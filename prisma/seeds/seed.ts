/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from ".prisma/client";
import b from "bcrypt";
import { EMAIL_VALIDATION_STATUS } from "../../constants/emailValidationStatus";
import { HASGING_ALGOS } from "../../constants/hashingAlgos";
import { ROLES } from "../../constants/roles";

const prisma = new PrismaClient();

async function main() {
  // insert roles that not exist in roles table yet
  const roles = await Promise.all(
    Object.keys(ROLES).map(async (name) => {
      const exist = await prisma.roles.findFirst({
        where: { name, deletedAt: null },
      });
      if (!exist) return name;
      return "";
    })
  );
  await Promise.all(
    roles
      .filter((name) => !!name)
      .map(async (name) => {
        return await prisma.roles.create({ data: { name } });
      })
  );
  //  get the super admin role
  const rolesAdmin = await prisma.roles.findFirst({
    where: { name: ROLES.ADMIN },
  });
  const rolesAdminRoot = await prisma.roles.findFirst({
    where: { name: ROLES.ADMIN_ROOT },
  });

  // insert emailValidationStatus that not exist in roles table yet
  const emailValidationStatus = await Promise.all(
    Object.keys(EMAIL_VALIDATION_STATUS).map(async (status) => {
      const exist = await prisma.emailValidationStatus.findFirst({
        where: { status, deletedAt: null },
      });
      if (!exist) return status;
      return "";
    })
  );
  await Promise.all(
    emailValidationStatus
      .filter((status) => !!status)
      .map(async (status) => {
        return await prisma.emailValidationStatus.create({
          data: { status },
        });
      })
  );
  // get emailValidationStatusId
  const emailValidationStatusId = (await prisma.emailValidationStatus.findFirst(
    {
      where: { status: EMAIL_VALIDATION_STATUS.EMAIL_VERIFY_SUCESS },
    }
  ))!.id;

  // get hashingAlgo, create one if not exist
  let hashingAlgo = await prisma.hashingAlgos.findFirst({
    where: { algoName: HASGING_ALGOS.BCRYPT },
  });
  if (!hashingAlgo) {
    hashingAlgo = await prisma.hashingAlgos.create({
      data: { algoName: HASGING_ALGOS.BCRYPT },
    });
  }

  const passwordRound = 10;
  const passwordSalt = await b.genSalt(passwordRound);
  const passwordHash = await b.hash("admin.super", passwordSalt);
  await prisma.userAccounts.upsert({
    where: { email: "admin.super@hello.io" },
    update: {},
    create: {
      firstName: "super",
      lastName: "admin",
      gender: "M",
      dateOfBirth: new Date(2000, 1, 1),
      email: "admin.super@hello.io",
      userLoginData: {
        create: {
          passwordHash,
          passwordSalt,
          passwordRound,
          hashingAlgoId: hashingAlgo.id,
        },
      },
      emailValidationStatusId,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
