#!/usr/bin/env ts-node

import "reflect-metadata";
import { buildSchemaSync, emitSchemaDefinitionFileSync } from "type-graphql";
import resolvers from "@src/resolvers";
import authChecker from "@src/authChecker";

const schema = buildSchemaSync({ resolvers, authChecker });
emitSchemaDefinitionFileSync("./schema.gql", schema);
