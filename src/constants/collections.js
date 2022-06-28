import { collection } from "firebase/firestore";
import { firestore } from "../firebase";
import { keys } from "./keys";

export const collections = {
  users: collection(firestore, keys.collection_users),
  courses: collection(firestore, keys.collection_courses),
  teachers: collection(firestore, keys.collection_teachers),
  tests: collection(firestore, keys.collection_tests),
};
