import { type NextPage } from "next";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Container, Stack, FormControl, FormLabel, FormHelperText, Input, Button, Flex, PinInput, PinInputField, Box } from '@chakra-ui/react'
// import { api } from "../utils/api";
import { type ChangeEventHandler, useState } from "react";
// import { z } from "zod";

// const validEmail = z
//   .string()
//   .min(1, { message: "This field has to be filled." })
//   .email("This is not a valid email.")

const Home: NextPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const handleEmailChange: ChangeEventHandler<HTMLInputElement> = ({ target: { value: email } }) => {
    setEmail(email)
  }
  const handlePasswordChange: ChangeEventHandler<HTMLInputElement> = ({ target: { value: password } }) => {
    setPassword(password)
  }
  const handleOPTComplete = (opt: string) => {
    console.log(opt)
  }
  const handlePageChange = (dir: "prev" | "next") => {
    setCurrentPage((prev) => {
      if (dir === "prev" && prev > 1) return prev - 1
      if (dir === "next" && prev < 3) return prev + 1
      return prev
    });
  }

  return (
    <Container>
      <Stack spacing={6}>
        <Breadcrumb separator='>>'>
          <BreadcrumbItem isCurrentPage={currentPage === 1}>
            <BreadcrumbLink as="p">Email</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage={currentPage === 2}>
            <BreadcrumbLink as="p">Password</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage={currentPage === 3}>
            <BreadcrumbLink as="p">Verify OPT</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        {currentPage === 1 && (
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input variant='filled' type='email' value={email} onChange={handleEmailChange} />
            <FormHelperText>demo only, do not use actual email</FormHelperText>
          </FormControl>
        )}
        {currentPage === 2 && (
          <FormControl>
            <FormLabel>Login or Set Password</FormLabel>
            <Input variant='filled' type='password' value={password} onChange={handlePasswordChange} />
            <FormHelperText>demo only, do not use actual password</FormHelperText>
          </FormControl>
        )}
        {currentPage === 3 && (
          <FormControl>
            <FormLabel>One Time Password</FormLabel>
            <PinInput otp placeholder="" onComplete={handleOPTComplete}>
              <PinInputField autoFocus />
              <PinInputField />
              <PinInputField />
              <PinInputField />
            </PinInput>
            <FormHelperText>demo only, just type 1111 as default</FormHelperText>
          </FormControl>
        )}
        <Flex grow={1} justify="space-between">
          <Button colorScheme='teal' size='sm' isDisabled={currentPage === 1} onClick={() => handlePageChange("prev")}>
            &lt; Prev
          </Button>
          {currentPage === 3 ?
            <Button colorScheme='teal' size='sm'>
              Send &gt;
            </Button>
            :
            <Button colorScheme='teal' size='sm' onClick={() => handlePageChange("next")}>
              Next &gt;
            </Button>
          }
        </Flex>
      </Stack>
    </Container>
  );
};

export default Home;
