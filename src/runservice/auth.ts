import * as firebase from 'firebase';

export class AuthService {

    signin(email: string, password: string) {
        return firebase.auth().signInWithEmailAndPassword(email, password);

    }

    signup(email: string, password: string) {
        return firebase.auth().createUserWithEmailAndPassword(email, password);

    }

    sendPasswordReset(email: string) {

        return firebase.auth().sendPasswordResetEmail(email);

    }

}