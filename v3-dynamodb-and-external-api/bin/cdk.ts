#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CdkSimpleWebserviceStack } from "../lib/cdk-stack";

const app = new cdk.App();
new CdkSimpleWebserviceStack(app, "cdk-simple-webservice-v3");
