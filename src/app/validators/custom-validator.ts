import { FormControl, ValidationErrors } from "@angular/forms";
import { Observable } from "rxjs";

export class CustomValidator {

    //whitesapace validator
    static notOnlyWhitespace(control: FormControl):ValidationErrors|null {

        //check if string only contains whitespace
        if ((control.value != null) && (control.value.trim().length === 0)) {

            //invalid then return error object the HTML will call it
            return { 'notOnlyWhitespace': true }
        }
        else{
            return null;
        }
    }
}
