"use client" // this is required

import { Amplify, Auth } from "aws-amplify"
import { config } from "./config"

Auth.configure({ ...config, ssr: true })
Amplify.configure({ ...config, ssr: true })
