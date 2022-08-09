import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { UserEntity } from "src/users/entities/user.entity";

/* Creating a generic interface that can be used to return data from the
interceptor. */
export interface Response<T> {
  data: T;
}

/**
 * If the user is not offline and the difference between the current time and the
 * latest time online is greater than 4 seconds, then set the user's status to
 * offline.
 * @param user - UserEntity - this is the object that is being passed in to the
 * function.
 * @returns A function that takes a UserEntity and returns a UserEntity
 */
const verifyUserStatus: (user: UserEntity) => UserEntity = (user) => {
  var currentTime = Number(Math.round(new Date().getTime() / 1000).toString());
  if (user.status !== 'Offline' && (currentTime - Number(user.latestTimeOnline)) > 4) {
    user.status = 'Offline';
  }
  return user;
}

/**
 * It takes an object, checks if it's an object, if it is, it loops through the
 * object's properties, if the property is an object, it calls itself on that
 * property, if the property is the latestTimeOnline property of a UserEntity, it
 * calls the verifyUserStatus function on that property
 * @param obj - any - The object that we're going to be searching through.
 * @returns the object that is passed in.
 */
const findUserObj: (obj: any) => any = (obj) => {
  if (typeof obj !== "object" || obj === null) return obj;
  for (let [key, value] of Object.entries(obj)) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      obj[key] = findUserObj(obj[key]);
    } else if (key === 'latestTimeOnline' && obj instanceof UserEntity) {
      obj = verifyUserStatus(obj);
    }
  }
  return obj;
}

/* This class is an interceptor that will be called before the response is sent
back to the client. It will find the user object in the response and set the
user's status to online */
@Injectable()
export class setUserStatusInterceptor<T> implements NestInterceptor<T, Response<T>> {
    /**
	 * The intercept function takes in a context and a next call handler. It then
	 * returns an observable of type Response<T>. The observable is a stream of
	 * data that can be subscribed to. The map function is used to transform the
	 * data. The map function takes in a function that takes in data and returns
	 * data. The data is then transformed by the findUserObj function
	 * @param {ExecutionContext} context - ExecutionContext - The context of the
	 * request.
	 * @param {CallHandler} next - CallHandler - This is the next handler in the
	 * chain.
	 * @returns The data is being returned.
	 */
	intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(map(data => {
      if (data === undefined || data === null) return data;
        data = findUserObj(data);
        return data;
    }));
  }
}
