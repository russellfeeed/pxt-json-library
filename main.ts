/**
 * Provides access to JSON micro:bit functionality.
 * Useful for constructing and sending data over HTTP
 * using something like wifi:bit
 */
//% color=190 weight=100 icon="\uf5fc" block="JSON Blocks"
namespace jsonBlocks {

    class ElementArrayReference {
        array: Elementx[];
    }
    class Elementx {
        typex: ElementType;
        object: StringElementMap;
        array: Elementx[];
        stringx: string[];
        numberx: number;
        booleanValue: boolean;
    }
    class ElementReference {
        element: Elementx;
    }
    class ElementType {
        name: string[];
    }
    class Token {
        typex: TokenType;
        value: string[];
    }
    class TokenReference {
        token: Token;
    }
    class TokenType {
        name: string[];
    }
    class TokenArrayReference {
        array: Token[];
    }
    class StringElementMap {
        stringListRef: StringArrayReference;
        elementListRef: ElementArrayReference;
    }
    class Example {
        a: string[];
        b: number[];
        x: X;
    }
    class X {
        x1: string[];
        x1IsNull: boolean;
        x2: boolean;
        x3: boolean;
    }
    class BooleanArrayReference {
        booleanArray: boolean[];
    }
    class BooleanReference {
        booleanValue: boolean;
    }
    class CharacterReference {
        characterValue: string;
    }
    class NumberArrayReference {
        numberArray: number[];
    }
    class NumberReference {
        numberValue: number;
    }
    class StringArrayReference {
        stringArray: StringReference[];
    }
    class StringReference {
        stringx: string[];
    }
    function IsValidJSON(json: string[], errorMessage: StringArrayReference): boolean {
        var success: boolean;
        var elementReference: ElementReference;

        elementReference = new ElementReference();

        success = ReadJSON(json, elementReference, errorMessage);

        if (success) {
            DeleteElement(elementReference.element);
        }

        return success;
    }


    function JSONTokenize(stringx: string[], tokenArrayReference: TokenArrayReference, errorMessages: StringArrayReference): boolean {
        var count: NumberReference;
        var success: boolean;

        count = CreateNumberReference(0);
        success = JSONTokenizeWithCountOption(stringx, tokenArrayReference, count, false, errorMessages);

        if (success) {
            tokenArrayReference.array = [];
            JSONTokenizeWithCountOption(stringx, tokenArrayReference, count, true, errorMessages);
        }

        return success;
    }


    function JSONTokenizeWithCountOption(json: string[], tokenArrayReference: TokenArrayReference, countReference: NumberReference, add: boolean, errorMessages: StringArrayReference): boolean {
        var tokens: Token[];
        var i: number, t: number;
        var c: string;
        var numberToken: Token;
        var str: string[];
        var stringReference: StringReference;
        var tokenReference: TokenReference;
        var stringLength: NumberReference;
        var success: boolean;

        success = true;

        tokenReference = new TokenReference();
        countReference.numberValue = 0;

        if (add) {
            tokens = tokenArrayReference.array;
        } else {
            tokens = [];
        }
        stringLength = new NumberReference();
        t = 0;

        for (i = 0; i < json.length && success;) {
            c = json[i];

            if (c == '{') {
                if (add) {
                    tokens[t] = CreateToken(GetTokenType("openCurly".split('')));
                    t = t + 1;
                } else {
                    countReference.numberValue = countReference.numberValue + 1;
                }
                i = i + 1;
            } else if (c == '}') {
                if (add) {
                    tokens[t] = CreateToken(GetTokenType("closeCurly".split('')));
                    t = t + 1;
                } else {
                    countReference.numberValue = countReference.numberValue + 1;
                }
                i = i + 1;
            } else if (c == '[') {
                if (add) {
                    tokens[t] = CreateToken(GetTokenType("openSquare".split('')));
                    t = t + 1;
                } else {
                    countReference.numberValue = countReference.numberValue + 1;
                }
                i = i + 1;
            } else if (c == ']') {
                if (add) {
                    tokens[t] = CreateToken(GetTokenType("closeSquare".split('')));
                    t = t + 1;
                } else {
                    countReference.numberValue = countReference.numberValue + 1;
                }
                i = i + 1;
            } else if (c == ':') {
                if (add) {
                    tokens[t] = CreateToken(GetTokenType("colon".split('')));
                    t = t + 1;
                } else {
                    countReference.numberValue = countReference.numberValue + 1;
                }
                i = i + 1;
            } else if (c == ',') {
                if (add) {
                    tokens[t] = CreateToken(GetTokenType("comma".split('')));
                    t = t + 1;
                } else {
                    countReference.numberValue = countReference.numberValue + 1;
                }
                i = i + 1;
            } else if (c == 'f') {
                success = GetJSONPrimitiveName(json, i, errorMessages, "false".split(''), tokenReference);
                if (success) {
                    if (add) {
                        tokens[t] = tokenReference.token;
                        t = t + 1;
                    } else {
                        countReference.numberValue = countReference.numberValue + 1;
                    }
                    i = i + "false".split('').length;
                }
            } else if (c == 't') {
                success = GetJSONPrimitiveName(json, i, errorMessages, "true".split(''), tokenReference);
                if (success) {
                    if (add) {
                        tokens[t] = tokenReference.token;
                        t = t + 1;
                    } else {
                        countReference.numberValue = countReference.numberValue + 1;
                    }
                    i = i + "true".split('').length;
                }
            } else if (c == 'n') {
                success = GetJSONPrimitiveName(json, i, errorMessages, "null".split(''), tokenReference);
                if (success) {
                    if (add) {
                        tokens[t] = tokenReference.token;
                        t = t + 1;
                    } else {
                        countReference.numberValue = countReference.numberValue + 1;
                    }
                    i = i + "null".split('').length;
                }
            } else if (c == ' ' || c == '\n' || c == '\t' || c == '\r') {
                /* Skip.*/
                i = i + 1;
            } else if (c == '\"') {
                success = GetJSONString(json, i, tokenReference, stringLength, errorMessages);
                if (success) {
                    i = i + stringLength.numberValue;
                    if (add) {
                        tokens[t] = tokenReference.token;
                        t = t + 1;
                    } else {
                        countReference.numberValue = countReference.numberValue + 1;
                    }
                }
            } else if (IsJSONNumberCharacter(c)) {
                success = GetJSONNumberToken(json, i, tokenReference, errorMessages);
                if (success) {
                    numberToken = tokenReference.token;
                    i = i + numberToken.value.length;
                    if (add) {
                        tokens[t] = numberToken;
                        t = t + 1;
                    } else {
                        countReference.numberValue = countReference.numberValue + 1;
                    }
                }
            } else {
                str = strConcatenateCharacter("Invalid start of Token: ".split(''), c);
                stringReference = CreateStringReference(str);
                AddStringRef(errorMessages, stringReference);
                i = i + 1;
                success = false;
            }
        }

        if (success) {
            if (add) {
                tokens[t] = CreateToken(GetTokenType("end".split('')));
                t = t + 1;
            } else {
                countReference.numberValue = countReference.numberValue + 1;
            }
            tokenArrayReference.array = tokens;
        }

        return success;
    }


    function GetJSONNumberToken(json: string[], start: number, tokenReference: TokenReference, errorMessages: StringArrayReference): boolean {
        var c: string;
        var end: number, i: number;
        var done: boolean, success: boolean;
        var numberString: string[];

        end = json.length;
        done = false;

        for (i = start; i < json.length && !done; i = i + 1) {
            c = json[i];
            if (!IsJSONNumberCharacter(c)) {
                done = true;
                end = i;
            }
        }

        numberString = strSubstring(json, start, end);

        success = IsValidJSONNumber(numberString, errorMessages);

        tokenReference.token = CreateNumberToken(numberString);

        return success;
    }


    function IsValidJSONNumber(n: string[], errorMessages: StringArrayReference): boolean {
        var success: boolean;
        var i: number;

        i = 0;

        /* JSON allows an optional negative sign.*/
        if (n[i] == '-') {
            i = i + 1;
        }

        if (i < n.length) {
            success = IsValidJSONNumberAfterSign(n, i, errorMessages);
        } else {
            success = false;
            AddStringRef(errorMessages, CreateStringReference("Number must contain at least one digit.".split('')));
        }

        return success;
    }


    function IsValidJSONNumberAfterSign(n: string[], i: number, errorMessages: StringArrayReference): boolean {
        var success: boolean;

        if (charIsNumber(n[i])) {
            /* 0 first means only 0.*/
            if (n[i] == '0') {
                i = i + 1;
            } else {
                /* 1-9 first, read following digits.*/
                i = IsValidJSONNumberAdvancePastDigits(n, i);
            }

            if (i < n.length) {
                success = IsValidJSONNumberFromDotOrExponent(n, i, errorMessages);
            } else {
                /* If integer, we are done now.*/
                success = true;
            }
        } else {
            success = false;
            AddStringRef(errorMessages, CreateStringReference("A number must start with 0-9 (after the optional sign).".split('')));
        }

        return success;
    }


    function IsValidJSONNumberAdvancePastDigits(n: string[], i: number): number {
        var done: boolean;

        i = i + 1;
        done = false;
        for (; i < n.length && !done;) {
            if (charIsNumber(n[i])) {
                i = i + 1;
            } else {
                done = true;
            }
        }

        return i;
    }


    function IsValidJSONNumberFromDotOrExponent(n: string[], i: number, errorMessages: StringArrayReference): boolean {
        var wasDotAndOrE: boolean, success: boolean;

        wasDotAndOrE = false;
        success = true;

        if (n[i] == '.') {
            i = i + 1;
            wasDotAndOrE = true;

            if (i < n.length) {
                if (charIsNumber(n[i])) {
                    /* Read digits following decimal point.*/
                    i = IsValidJSONNumberAdvancePastDigits(n, i);

                    if (i == n.length) {
                        /* If non-scientific decimal number, we are done.*/
                        success = true;
                    }
                } else {
                    success = false;
                    AddStringRef(errorMessages, CreateStringReference("There must be numbers after the decimal point.".split('')));
                }
            } else {
                success = false;
                AddStringRef(errorMessages, CreateStringReference("There must be numbers after the decimal point.".split('')));
            }
        }

        if (i < n.length && success) {
            if (n[i] == 'e' || n[i] == 'E') {
                wasDotAndOrE = true;
                success = IsValidJSONNumberFromExponent(n, i, errorMessages);
            } else {
                success = false;
                AddStringRef(errorMessages, CreateStringReference("Expected e or E.".split('')));
            }
        } else if (i == n.length && success) {
            /* If number with decimal point.*/
            success = true;
        } else {
            success = false;
            AddStringRef(errorMessages, CreateStringReference("There must be numbers after the decimal point.".split('')));
        }

        if (wasDotAndOrE) {
        } else {
            success = false;
            AddStringRef(errorMessages, CreateStringReference("Exprected decimal point or e or E.".split('')));
        }

        return success;
    }


    function IsValidJSONNumberFromExponent(n: string[], i: number, errorMessages: StringArrayReference): boolean {
        var success: boolean;

        i = i + 1;

        if (i < n.length) {
            /* The exponent sign can either + or -,*/
            if (n[i] == '+' || n[i] == '-') {
                i = i + 1;
            }

            if (i < n.length) {
                if (charIsNumber(n[i])) {
                    /* Read digits following decimal point.*/
                    i = IsValidJSONNumberAdvancePastDigits(n, i);

                    if (i == n.length) {
                        /* We found scientific number.*/
                        success = true;
                    } else {
                        success = false;
                        AddStringRef(errorMessages, CreateStringReference("There was characters following the exponent.".split('')));
                    }
                } else {
                    success = false;
                    AddStringRef(errorMessages, CreateStringReference("There must be a digit following the optional exponent sign.".split('')));
                }
            } else {
                success = false;
                AddStringRef(errorMessages, CreateStringReference("There must be a digit following optional the exponent sign.".split('')));
            }
        } else {
            success = false;
            AddStringRef(errorMessages, CreateStringReference("There must be a sign or a digit following e or E.".split('')));
        }

        return success;
    }


    function IsJSONNumberCharacter(c: string): boolean {
        var numericCharacters: string[];
        var found: boolean;
        var i: number;

        numericCharacters = "0123456789.-+eE".split('');

        found = false;

        for (i = 0; i < numericCharacters.length; i = i + 1) {
            if (numericCharacters[i] == c) {
                found = true;
            }
        }

        return found;
    }


    function GetJSONPrimitiveName(stringx: string[], start: number, errorMessages: StringArrayReference, primitive: string[], tokenReference: TokenReference): boolean {
        var c: string, p: string;
        var token: Token;
        var done: boolean, success: boolean;
        var i: number;
        var str: string[];

        token = new Token();
        done = false;
        success = true;

        for (i = start; i < stringx.length && ((i - start) < primitive.length) && !done; i = i + 1) {
            c = stringx[i];
            p = primitive[i - start];
            if (c == p) {
                /* OK*/
                if ((i + 1 - start) == primitive.length) {
                    done = true;
                }
            } else {
                str = "".split('');
                str = strConcatenateString(str, "Primitive invalid: ".split(''));
                str = strAppendCharacter(str, c);
                str = strAppendString(str, " vs ".split(''));
                str = strAppendCharacter(str, p);

                AddStringRef(errorMessages, CreateStringReference(str));
                done = true;
                success = false;
            }
        }

        if (done) {
            if (StringsEqual(primitive, "false".split(''))) {
                token = CreateToken(GetTokenType("falseValue".split('')));
            }
            if (StringsEqual(primitive, "true".split(''))) {
                token = CreateToken(GetTokenType("trueValue".split('')));
            }
            if (StringsEqual(primitive, "null".split(''))) {
                token = CreateToken(GetTokenType("nullValue".split('')));
            }
        } else {
            AddStringRef(errorMessages, CreateStringReference("Primitive invalid".split('')));
            success = false;
        }

        tokenReference.token = token;

        return success;
    }


    function GetJSONString(json: string[], start: number, tokenReference: TokenReference, stringLengthReference: NumberReference, errorMessages: StringArrayReference): boolean {
        var success: boolean, done: boolean;
        var stringx: string[], hex: string[];
        var characterCount: NumberReference, hexReference: NumberReference;
        var i: number, l: number, c: number;
        var errorMessage: StringReference;

        characterCount = CreateNumberReference(0);
        hex = CreateString(4, '0');
        hexReference = new NumberReference();
        errorMessage = new StringReference();

        success = IsValidJSONStringInJSON(json, start, characterCount, stringLengthReference, errorMessages);

        if (success) {
            l = characterCount.numberValue;
            stringx = [];

            c = 0;
            stringx[c] = '\"';
            c = c + 1;

            done = false;
            for (i = start + 1; !done; i = i + 1) {
                if (json[i] == '\\') {
                    i = i + 1;
                    if (json[i] == '\"' || json[i] == '\\' || json[i] == '/') {
                        stringx[c] = json[i];
                        c = c + 1;
                    } else if (json[i] == 'b') {
                        stringx[c] = String.fromCharCode(8);
                        c = c + 1;
                    } else if (json[i] == 'f') {
                        stringx[c] = String.fromCharCode(12);
                        c = c + 1;
                    } else if (json[i] == 'n') {
                        stringx[c] = String.fromCharCode(10);
                        c = c + 1;
                    } else if (json[i] == 'r') {
                        stringx[c] = String.fromCharCode(13);
                        c = c + 1;
                    } else if (json[i] == 't') {
                        stringx[c] = String.fromCharCode(9);
                        c = c + 1;
                    } else if (json[i] == 'u') {
                        i = i + 1;
                        hex[0] = charToUpperCase(json[i + 0]);
                        hex[1] = charToUpperCase(json[i + 1]);
                        hex[2] = charToUpperCase(json[i + 2]);
                        hex[3] = charToUpperCase(json[i + 3]);
                        nCreateNumberFromStringWithCheck(hex, 16, hexReference, errorMessage);
                        stringx[c] = String.fromCharCode(hexReference.numberValue);
                        i = i + 3;
                        c = c + 1;
                    }
                } else if (json[i] == '\"') {
                    stringx[c] = json[i];
                    c = c + 1;
                    done = true;
                } else {
                    stringx[c] = json[i];
                    c = c + 1;
                }
            }

            tokenReference.token = CreateStringToken(stringx);
            success = true;
        } else {
            AddStringRef(errorMessages, CreateStringReference("End of string was not found.".split('')));
            success = false;
        }

        return success;
    }


    function IsValidJSONString(jsonString: string[], errorMessages: StringArrayReference): boolean {
        var valid: boolean;
        var numberReference: NumberReference, stringLength: NumberReference;

        numberReference = new NumberReference();
        stringLength = new NumberReference();

        valid = IsValidJSONStringInJSON(jsonString, 0, numberReference, stringLength, errorMessages);

        return valid;
    }


    function IsValidJSONStringInJSON(json: string[], start: number, characterCount: NumberReference, stringLengthReference: NumberReference, errorMessages: StringArrayReference): boolean {
        var success: boolean, done: boolean;
        var i: number, j: number;
        var c: string;

        success = true;
        done = false;

        characterCount.numberValue = 1;

        for (i = start + 1; i < json.length && !done && success; i = i + 1) {
            if (!IsJSONIllegalControllCharacter(json[i])) {
                if (json[i] == '\\') {
                    i = i + 1;
                    if (i < json.length) {
                        if (json[i] == '\"' || json[i] == '\\' || json[i] == '/' || json[i] == 'b' || json[i] == 'f' || json[i] == 'n' || json[i] == 'r' || json[i] == 't') {
                            characterCount.numberValue = characterCount.numberValue + 1;
                        } else if (json[i] == 'u') {
                            if (i + 4 < json.length) {
                                for (j = 0; j < 4 && success; j = j + 1) {
                                    c = json[i + j + 1];
                                    if (nCharacterIsNumberCharacterInBase(c, 16) || c == 'a' || c == 'b' || c == 'c' || c == 'd' || c == 'e' || c == 'f') {
                                    } else {
                                        success = false;
                                        AddStringRef(errorMessages, CreateStringReference("\\u must be followed by four hexadecimal digits.".split('')));
                                    }
                                }
                                characterCount.numberValue = characterCount.numberValue + 1;
                                i = i + 4;
                            } else {
                                success = false;
                                AddStringRef(errorMessages, CreateStringReference("\\u must be followed by four characters.".split('')));
                            }
                        } else {
                            success = false;
                            AddStringRef(errorMessages, CreateStringReference("Escaped character invalid.".split('')));
                        }
                    } else {
                        success = false;
                        AddStringRef(errorMessages, CreateStringReference("There must be at least two character after string escape.".split('')));
                    }
                } else if (json[i] == '\"') {
                    characterCount.numberValue = characterCount.numberValue + 1;
                    done = true;
                } else {
                    characterCount.numberValue = characterCount.numberValue + 1;
                }
            } else {
                success = false;
                AddStringRef(errorMessages, CreateStringReference("Unicode code points 0-31 not allowed in JSON string.".split('')));
            }
        }

        if (done) {
            stringLengthReference.numberValue = i - start;
        } else {
            success = false;
            AddStringRef(errorMessages, CreateStringReference("String must end with \".".split('')));
        }

        return success;
    }


    function IsJSONIllegalControllCharacter(c: string): boolean {
        var cnr: number;
        var isControll: boolean;

        cnr = c.charCodeAt(0);

        if (cnr >= 0 && cnr < 32) {
            isControll = true;
        } else {
            isControll = false;
        }

        return isControll;
    }


    function CreateToken(tokenType: TokenType): Token {
        var token: Token;
        token = new Token();
        token.typex = tokenType;
        return token;
    }


    function CreateStringToken(stringx: string[]): Token {
        var token: Token;
        token = new Token();
        token.typex = GetTokenType("string".split(''));
        token.value = stringx;
        return token;
    }


    function CreateNumberToken(stringx: string[]): Token {
        var token: Token;
        token = new Token();
        token.typex = GetTokenType("number".split(''));
        token.value = stringx;
        return token;
    }


    function AddElement(list: Elementx[], a: Elementx): Elementx[] {
        var newlist: Elementx[];
        var i: number;

        newlist = [];

        for (i = 0; i < list.length; i = i + 1) {
            newlist[i] = list[i];
        }
        newlist[list.length] = a;

        list = undefined;

        return newlist;
    }


    function AddElementRef(list: ElementArrayReference, i: Elementx): void {
        list.array = AddElement(list.array, i);
    }


    function RemoveElement(list: Elementx[], n: number): Elementx[] {
        var newlist: Elementx[];
        var i: number;

        newlist = [];

        for (i = 0; i < list.length; i = i + 1) {
            if (i < n) {
                newlist[i] = list[i];
            }
            if (i > n) {
                newlist[i - 1] = list[i];
            }
        }

        list = undefined;

        return newlist;
    }


    function GetElementRef(list: ElementArrayReference, i: number): Elementx {
        return list.array[i];
    }


    function RemoveElementRef(list: ElementArrayReference, i: number): void {
        list.array = RemoveElement(list.array, i);
    }


    function ComputeJSONStringLength(element: Elementx): number {
        var result: number;

        result = 0;

        if (ElementTypeEnumEquals(element.typex.name, "object".split(''))) {
            result = result + ComputeJSONObjectStringLength(element);
        } else if (ElementTypeEnumEquals(element.typex.name, "string".split(''))) {
            result = JSONEscapedStringLength(element.stringx) + 2;
        } else if (ElementTypeEnumEquals(element.typex.name, "array".split(''))) {
            result = result + ComputeJSONArrayStringLength(element);
        } else if (ElementTypeEnumEquals(element.typex.name, "number".split(''))) {
            result = result + ComputeJSONNumberStringLength(element);
        } else if (ElementTypeEnumEquals(element.typex.name, "nullValue".split(''))) {
            result = result + "null".split('').length;
        } else if (ElementTypeEnumEquals(element.typex.name, "booleanValue".split(''))) {
            result = result + ComputeJSONBooleanStringLength(element);
        }

        return result;
    }


    function ComputeJSONBooleanStringLength(element: Elementx): number {
        var result: number;

        if (element.booleanValue) {
            result = "true".split('').length;
        } else {
            result = "false".split('').length;
        }

        return result;
    }


    function ComputeJSONNumberStringLength(element: Elementx): number {
        var length: number;
        var a: string[];

        if (Math.abs(element.numberx) >= 10 ** 15 || Math.abs(element.numberx) <= 10 ** (-15)) {
            a = nCreateStringScientificNotationDecimalFromNumber(element.numberx);
            length = a.length;
        } else {
            a = nCreateStringDecimalFromNumber(element.numberx);
            length = a.length;
        }

        return length;
    }


    function ComputeJSONArrayStringLength(element: Elementx): number {
        var arrayElement: Elementx;
        var i: number;
        var length: number;

        length = 1;

        for (i = 0; i < element.array.length; i = i + 1) {
            arrayElement = element.array[i];

            length = length + ComputeJSONStringLength(arrayElement);

            if (i + 1 != element.array.length) {
                length = length + 1;
            }
        }

        length = length + 1;

        return length;
    }


    function ComputeJSONObjectStringLength(element: Elementx): number {
        var key: string[];
        var i: number;
        var keys: StringArrayReference;
        var objectElement: Elementx;
        var length: number;

        length = 1;

        keys = GetStringElementMapKeySet(element.object);
        for (i = 0; i < keys.stringArray.length; i = i + 1) {
            key = keys.stringArray[i].stringx;
            objectElement = GetObjectValue(element.object, key);

            length = length + 1;
            length = length + JSONEscapedStringLength(key);
            length = length + 1;
            length = length + 1;

            length = length + ComputeJSONStringLength(objectElement);

            if (i + 1 != keys.stringArray.length) {
                length = length + 1;
            }
        }

        length = length + 1;

        return length;
    }


    function CreateStringElement(stringx: string[]): Elementx {
        var element: Elementx;
        element = new Elementx();
        element.typex = GetElementType("string".split(''));
        element.stringx = stringx;
        return element;
    }


    function CreateBooleanElement(booleanValue: boolean): Elementx {
        var element: Elementx;
        element = new Elementx();
        element.typex = GetElementType("booleanValue".split(''));
        element.booleanValue = booleanValue;
        return element;
    }


    function CreateNullElement(): Elementx {
        var element: Elementx;
        element = new Elementx();
        element.typex = GetElementType("nullValue".split(''));
        return element;
    }


    function CreateNumberElement(numberx: number): Elementx {
        var element: Elementx;
        element = new Elementx();
        element.typex = GetElementType("number".split(''));
        element.numberx = numberx;
        return element;
    }


    function CreateArrayElement(length: number): Elementx {
        var element: Elementx;
        element = new Elementx();
        element.typex = GetElementType("array".split(''));
        element.array = [];
        return element;
    }


    function CreateObjectElement(length: number): Elementx {
        var element: Elementx;
        element = new Elementx();
        element.typex = GetElementType("object".split(''));
        element.object = new StringElementMap();
        element.object.stringListRef = CreateStringArrayReferenceLengthValue(length, "".split(''));
        element.object.elementListRef = new ElementArrayReference();
        //		element.object.elementListRef.array = [];
        element.object.elementListRef.array = [];
        return element;
    }


    function DeleteElement(element: Elementx): void {
        if (ElementTypeEnumEquals(element.typex.name, "object".split(''))) {
            DeleteObject(element);
        } else if (ElementTypeEnumEquals(element.typex.name, "string".split(''))) {
            element = undefined;
        } else if (ElementTypeEnumEquals(element.typex.name, "array".split(''))) {
            DeleteArray(element);
        } else if (ElementTypeEnumEquals(element.typex.name, "number".split(''))) {
            element = undefined;
        } else if (ElementTypeEnumEquals(element.typex.name, "nullValue".split(''))) {
            element = undefined;
        } else if (ElementTypeEnumEquals(element.typex.name, "booleanValue".split(''))) {
            element = undefined;
        } else {
        }
    }


    function DeleteObject(element: Elementx): void {
        var keys: StringArrayReference;
        var i: number;
        var key: string[];
        var objectElement: Elementx;

        keys = GetStringElementMapKeySet(element.object);
        for (i = 0; i < keys.stringArray.length; i = i + 1) {
            key = keys.stringArray[i].stringx;
            objectElement = GetObjectValue(element.object, key);
            DeleteElement(objectElement);
        }
    }


    function DeleteArray(element: Elementx): void {
        var i: number;
        var arrayElement: Elementx;

        for (i = 0; i < element.array.length; i = i + 1) {
            arrayElement = element.array[i];
            DeleteElement(arrayElement);
        }
    }

    //% block
    export function WriteJSON(element: Elementx): string[] {
        var result: string[];
        var length: number;
        var index: NumberReference;

        length = ComputeJSONStringLength(element);
        //		result = [];
        result = [];
        index = CreateNumberReference(0);

        if (ElementTypeEnumEquals(element.typex.name, "object".split(''))) {
            WriteObject(element, result, index);
        } else if (ElementTypeEnumEquals(element.typex.name, "string".split(''))) {
            WriteString(element, result, index);
        } else if (ElementTypeEnumEquals(element.typex.name, "array".split(''))) {
            WriteArray(element, result, index);
        } else if (ElementTypeEnumEquals(element.typex.name, "number".split(''))) {
            WriteNumber(element, result, index);
        } else if (ElementTypeEnumEquals(element.typex.name, "nullValue".split(''))) {
            strWriteStringToStingStream(result, index, "null".split(''));
        } else if (ElementTypeEnumEquals(element.typex.name, "booleanValue".split(''))) {
            WriteBooleanValue(element, result, index);
        }

        return result;
    }


    function WriteBooleanValue(element: Elementx, result: string[], index: NumberReference): void {
        if (element.booleanValue) {
            strWriteStringToStingStream(result, index, "true".split(''));
        } else {
            strWriteStringToStingStream(result, index, "false".split(''));
        }
    }


    function WriteNumber(element: Elementx, result: string[], index: NumberReference): void {
        var numberString: string[];

        if (Math.abs(element.numberx) >= 10 ** 15 || Math.abs(element.numberx) <= 10 ** (-15)) {
            numberString = nCreateStringScientificNotationDecimalFromNumber(element.numberx);
        } else {
            numberString = nCreateStringDecimalFromNumber(element.numberx);
        }

        strWriteStringToStingStream(result, index, numberString);
    }


    function WriteArray(element: Elementx, result: string[], index: NumberReference): void {
        var s: string[];
        var arrayElement: Elementx;
        var i: number;

        strWriteStringToStingStream(result, index, "[".split(''));

        for (i = 0; i < element.array.length; i = i + 1) {
            arrayElement = element.array[i];

            s = WriteJSON(arrayElement);
            strWriteStringToStingStream(result, index, s);

            if (i + 1 != element.array.length) {
                strWriteStringToStingStream(result, index, ",".split(''));
            }
        }

        strWriteStringToStingStream(result, index, "]".split(''));
    }


    function WriteString(element: Elementx, result: string[], index: NumberReference): void {
        strWriteStringToStingStream(result, index, "\"".split(''));
        element.stringx = JSONEscapeString(element.stringx);
        strWriteStringToStingStream(result, index, element.stringx);
        strWriteStringToStingStream(result, index, "\"".split(''));
    }


    function JSONEscapeString(stringx: string[]): string[] {
        var i: number, length: number;
        var index: NumberReference, lettersReference: NumberReference;
        var ns: string[], escaped: string[];

        length = JSONEscapedStringLength(stringx);

        //		ns = [];
        ns = [];
        index = CreateNumberReference(0);
        lettersReference = CreateNumberReference(0);

        for (i = 0; i < stringx.length; i = i + 1) {
            if (JSONMustBeEscaped(stringx[i], lettersReference)) {
                escaped = JSONEscapeCharacter(stringx[i]);
                strWriteStringToStingStream(ns, index, escaped);
            } else {
                strWriteCharacterToStingStream(ns, index, stringx[i]);
            }
        }

        return ns;
    }


    function JSONEscapedStringLength(stringx: string[]): number {
        var lettersReference: NumberReference;
        var i: number, length: number;

        lettersReference = CreateNumberReference(0);
        length = 0;

        for (i = 0; i < stringx.length; i = i + 1) {
            if (JSONMustBeEscaped(stringx[i], lettersReference)) {
                length = length + lettersReference.numberValue;
            } else {
                length = length + 1;
            }
        }
        return length;
    }


    function JSONEscapeCharacter(c: string): string[] {
        var code: number;
        var escaped: string[];
        var hexNumber: StringReference;
        var q: number, rs: number, s: number, b: number, f: number, n: number, r: number, t: number;

        code = c.charCodeAt(0);

        q = 34;
        rs = 92;
        s = 47;
        b = 8;
        f = 12;
        n = 10;
        r = 13;
        t = 9;

        hexNumber = new StringReference();

        if (code == q) {
            escaped = [];
            escaped[0] = '\\';
            escaped[1] = '\"';
        } else if (code == rs) {
            escaped = [];
            escaped[0] = '\\';
            escaped[1] = '\\';
        } else if (code == s) {
            escaped = [];
            escaped[0] = '\\';
            escaped[1] = '/';
        } else if (code == b) {
            escaped = [];
            escaped[0] = '\\';
            escaped[1] = 'b';
        } else if (code == f) {
            escaped = [];
            escaped[0] = '\\';
            escaped[1] = 'f';
        } else if (code == n) {
            escaped = [];
            escaped[0] = '\\';
            escaped[1] = 'n';
        } else if (code == r) {
            escaped = [];
            escaped[0] = '\\';
            escaped[1] = 'r';
        } else if (code == t) {
            escaped = [];
            escaped[0] = '\\';
            escaped[1] = 't';
        } else if (code >= 0 && code <= 31) {
            escaped = [];
            escaped[0] = '\\';
            escaped[1] = 'u';
            escaped[2] = '0';
            escaped[3] = '0';

            nCreateStringFromNumberWithCheck(code, 16, hexNumber);

            if (hexNumber.stringx.length == 1) {
                escaped[4] = '0';
                escaped[5] = hexNumber.stringx[0];
            } else if (hexNumber.stringx.length == 2) {
                escaped[4] = hexNumber.stringx[0];
                escaped[5] = hexNumber.stringx[1];
            }
        } else {
            escaped = [];
            escaped[0] = c;
        }

        return escaped;
    }


    function JSONMustBeEscaped(c: string, letters: NumberReference): boolean {
        var code: number;
        var mustBeEscaped: boolean;
        var q: number, rs: number, s: number, b: number, f: number, n: number, r: number, t: number;

        code = c.charCodeAt(0);
        mustBeEscaped = false;

        q = 34;
        rs = 92;
        s = 47;
        b = 8;
        f = 12;
        n = 10;
        r = 13;
        t = 9;

        if (code == q || code == rs || code == s || code == b || code == f || code == n || code == r || code == t) {
            mustBeEscaped = true;
            letters.numberValue = 2;
        } else if (code >= 0 && code <= 31) {
            mustBeEscaped = true;
            letters.numberValue = 6;
        } else if (code >= 2 ** 16) {
            mustBeEscaped = true;
            letters.numberValue = 6;
        }

        return mustBeEscaped;
    }


    function WriteObject(element: Elementx, result: string[], index: NumberReference): void {
        var s: string[], key: string[];
        var i: number;
        var keys: StringArrayReference;
        var objectElement: Elementx;

        strWriteStringToStingStream(result, index, "{".split(''));

        keys = GetStringElementMapKeySet(element.object);
        for (i = 0; i < keys.stringArray.length; i = i + 1) {
            key = keys.stringArray[i].stringx;
            key = JSONEscapeString(key);
            objectElement = GetObjectValue(element.object, key);

            strWriteStringToStingStream(result, index, "\"".split(''));
            strWriteStringToStingStream(result, index, key);
            strWriteStringToStingStream(result, index, "\"".split(''));
            strWriteStringToStingStream(result, index, ":".split(''));

            s = WriteJSON(objectElement);
            strWriteStringToStingStream(result, index, s);

            if (i + 1 != keys.stringArray.length) {
                strWriteStringToStingStream(result, index, ",".split(''));
            }
        }

        strWriteStringToStingStream(result, index, "}".split(''));
    }


    function ReadJSON(stringx: string[], elementReference: ElementReference, errorMessages: StringArrayReference): boolean {
        var tokenArrayReference: TokenArrayReference;
        var success: boolean;

        /* Tokenize.*/
        tokenArrayReference = new TokenArrayReference();
        success = JSONTokenize(stringx, tokenArrayReference, errorMessages);

        if (success) {
            /* Parse.*/
            success = GetJSONValue(tokenArrayReference.array, elementReference, errorMessages);
        }

        return success;
    }


    function GetJSONValue(tokens: Token[], elementReference: ElementReference, errorMessages: StringArrayReference): boolean {
        var counts: NumberArrayReference;
        var success: boolean;
        var i: NumberReference;

        i = CreateNumberReference(0);
        counts = CreateNumberArrayReferenceLengthValue(tokens.length, 0);

        success = GetJSONValueWithCheckOption(tokens, i, 0, elementReference, false, counts, errorMessages);

        if (success) {
            i.numberValue = 0;
            GetJSONValueWithCheckOption(tokens, i, 0, elementReference, true, counts, errorMessages);
        }

        return success;
    }


    function GetJSONValueWithCheckOption(tokens: Token[], i: NumberReference, depth: number, elementReference: ElementReference, add: boolean, counts: NumberArrayReference, errorMessages: StringArrayReference): boolean {
        var token: Token;
        var str: string[], substr: string[];
        var stringToDecimalResult: number;
        var success: boolean;

        success = true;
        token = tokens[i.numberValue];

        if (TokenTypeEnumEquals(token.typex.name, "openCurly".split(''))) {
            success = GetJSONObject(tokens, i, depth + 1, elementReference, add, counts, errorMessages);
        } else if (TokenTypeEnumEquals(token.typex.name, "openSquare".split(''))) {
            success = GetJSONArray(tokens, i, depth + 1, elementReference, add, counts, errorMessages);
        } else if (TokenTypeEnumEquals(token.typex.name, "trueValue".split(''))) {
            if (add) {
                elementReference.element = CreateBooleanElement(true);
            }
            i.numberValue = i.numberValue + 1;
        } else if (TokenTypeEnumEquals(token.typex.name, "falseValue".split(''))) {
            if (add) {
                elementReference.element = CreateBooleanElement(false);
            }
            i.numberValue = i.numberValue + 1;
        } else if (TokenTypeEnumEquals(token.typex.name, "nullValue".split(''))) {
            if (add) {
                elementReference.element = CreateNullElement();
            }
            i.numberValue = i.numberValue + 1;
        } else if (TokenTypeEnumEquals(token.typex.name, "number".split(''))) {
            if (add) {
                stringToDecimalResult = nCreateNumberFromDecimalString(token.value);
                elementReference.element = CreateNumberElement(stringToDecimalResult);
            }
            i.numberValue = i.numberValue + 1;
        } else if (TokenTypeEnumEquals(token.typex.name, "string".split(''))) {
            if (add) {
                substr = strSubstring(token.value, 1, token.value.length - 1);
                elementReference.element = CreateStringElement(substr);
            }
            i.numberValue = i.numberValue + 1;
        } else {
            str = "".split('');
            str = strConcatenateString(str, "Invalid token first in value: ".split(''));
            str = strAppendString(str, token.typex.name);
            AddStringRef(errorMessages, CreateStringReference(str));
            success = false;
        }

        if (success && depth == 0) {
            if (TokenTypeEnumEquals(tokens[i.numberValue].typex.name, "end".split(''))) {
            } else {
                AddStringRef(errorMessages, CreateStringReference("The outer value cannot have any tokens following it.".split('')));
                success = false;
            }
        }

        return success;
    }


    function GetJSONObject(tokens: Token[], i: NumberReference, depth: number, elementReference: ElementReference, add: boolean, counts: NumberArrayReference, errorMessages: StringArrayReference): boolean {
        var element: Elementx, value: Elementx;
        var done: boolean, success: boolean;
        var key: Token, colon: Token, comma: Token, closeCurly: Token;
        var keystring: string[], str: string[];
        var valueReference: ElementReference;
        var countIndex: number, index: number;

        countIndex = i.numberValue;
        if (add) {
            element = CreateObjectElement(counts.numberArray[countIndex]);
        } else {
            element = new Elementx();
        }
        valueReference = new ElementReference();
        success = true;
        i.numberValue = i.numberValue + 1;
        index = 0;

        if (!TokenTypeEnumEquals(tokens[i.numberValue].typex.name, "closeCurly".split(''))) {
            done = false;

            for (; !done && success;) {
                key = tokens[i.numberValue];

                if (TokenTypeEnumEquals(key.typex.name, "string".split(''))) {
                    i.numberValue = i.numberValue + 1;
                    colon = tokens[i.numberValue];
                    if (TokenTypeEnumEquals(colon.typex.name, "colon".split(''))) {
                        i.numberValue = i.numberValue + 1;
                        success = GetJSONValueWithCheckOption(tokens, i, depth, valueReference, add, counts, errorMessages);

                        if (success) {
                            keystring = strSubstring(key.value, 1, key.value.length - 1);
                            if (add) {
                                value = valueReference.element;
                                SetStringElementMap(element.object, index, keystring, value);
                            }

                            index = index + 1;

                            comma = tokens[i.numberValue];
                            if (TokenTypeEnumEquals(comma.typex.name, "comma".split(''))) {
                                /* OK*/
                                i.numberValue = i.numberValue + 1;
                            } else {
                                done = true;
                            }
                        }
                    } else {
                        str = "".split('');
                        str = strConcatenateString(str, "Expected colon after key in object: ".split(''));
                        str = strAppendString(str, colon.typex.name);
                        AddStringRef(errorMessages, CreateStringReference(str));

                        success = false;
                        done = true;
                    }
                } else {
                    AddStringRef(errorMessages, CreateStringReference("Expected string as key in object.".split('')));

                    done = true;
                    success = false;
                }
            }
        }

        if (success) {
            closeCurly = tokens[i.numberValue];

            if (TokenTypeEnumEquals(closeCurly.typex.name, "closeCurly".split(''))) {
                /* OK*/
                elementReference.element = element;
                i.numberValue = i.numberValue + 1;
            } else {
                AddStringRef(errorMessages, CreateStringReference("Expected close curly brackets at end of object value.".split('')));
                success = false;
            }
        }

        counts.numberArray[countIndex] = index;

        return success;
    }


    function GetJSONArray(tokens: Token[], i: NumberReference, depth: number, elementReference: ElementReference, add: boolean, counts: NumberArrayReference, errorMessages: StringArrayReference): boolean {
        var element: Elementx, value: Elementx;
        var nextToken: Token, comma: Token;
        var done: boolean, success: boolean;
        var valueReference: ElementReference;
        var countIndex: number, index: number;

        index = 0;
        countIndex = i.numberValue;
        i.numberValue = i.numberValue + 1;

        if (add) {
            element = CreateArrayElement(counts.numberArray[countIndex]);
        } else {
            element = new Elementx();
        }
        valueReference = new ElementReference();
        success = true;

        nextToken = tokens[i.numberValue];

        if (!TokenTypeEnumEquals(nextToken.typex.name, "closeSquare".split(''))) {
            done = false;
            for (; !done && success;) {
                success = GetJSONValueWithCheckOption(tokens, i, depth, valueReference, add, counts, errorMessages);

                if (success) {
                    if (add) {
                        value = valueReference.element;
                        element.array[index] = value;
                    }

                    index = index + 1;

                    comma = tokens[i.numberValue];

                    if (TokenTypeEnumEquals(comma.typex.name, "comma".split(''))) {
                        /* OK*/
                        i.numberValue = i.numberValue + 1;
                    } else {
                        done = true;
                    }
                }
            }
        }

        nextToken = tokens[i.numberValue];
        if (TokenTypeEnumEquals(nextToken.typex.name, "closeSquare".split(''))) {
            /* OK*/
            i.numberValue = i.numberValue + 1;
            elementReference.element = element;
        } else {
            AddStringRef(errorMessages, CreateStringReference("Expected close square bracket at end of array.".split('')));
            success = false;
        }

        elementReference.element = element;
        counts.numberArray[countIndex] = index;

        return success;
    }


    function GetStringElementMapKeySet(stringElementMap: StringElementMap): StringArrayReference {
        return stringElementMap.stringListRef;
    }


    function GetObjectValue(stringElementMap: StringElementMap, key: string[]): Elementx {
        var result: Elementx;
        var i: number;

        result = new Elementx();

        for (i = 0; i < GetStringElementMapNumberOfKeys(stringElementMap); i = i + 1) {
            if (StringsEqual(stringElementMap.stringListRef.stringArray[i].stringx, key)) {
                result = stringElementMap.elementListRef.array[i];
            }
        }

        return result;
    }


    function GetObjectValueWithCheck(stringElementMap: StringElementMap, key: string[], foundReference: BooleanReference): Elementx {
        var result: Elementx;
        var i: number;

        result = new Elementx();

        foundReference.booleanValue = false;
        for (i = 0; i < GetStringElementMapNumberOfKeys(stringElementMap); i = i + 1) {
            if (StringsEqual(stringElementMap.stringListRef.stringArray[i].stringx, key)) {
                result = stringElementMap.elementListRef.array[i];
                foundReference.booleanValue = true;
            }
        }

        return result;
    }


    function PutStringElementMap(stringElementMap: StringElementMap, keystring: string[], value: Elementx): void {
        AddStringRef(stringElementMap.stringListRef, CreateStringReference(keystring));
        AddElementRef(stringElementMap.elementListRef, value);
    }


    function SetStringElementMap(stringElementMap: StringElementMap, index: number, keystring: string[], value: Elementx): void {
        stringElementMap.stringListRef.stringArray[index].stringx = keystring;
        stringElementMap.elementListRef.array[index] = value;
    }


    function GetStringElementMapNumberOfKeys(stringElementMap: StringElementMap): number {
        return stringElementMap.stringListRef.stringArray.length;
    }


    function GetTokenType(elementTypeName: string[]): TokenType {
        var et: TokenType;

        et = new TokenType();
        et.name = elementTypeName;

        return et;
    }


    function GetAndCheckTokenType(elementTypeName: string[], found: BooleanReference): TokenType {
        var elementTypes: TokenType[];
        var tokenType: TokenType;
        var i: number, count: number;

        count = 12;

        elementTypes = [];

        for (i = 0; i < count; i = i + 1) {
            elementTypes[i] = new TokenType();
        }

        elementTypes[0].name = "openCurly".split('');
        elementTypes[1].name = "closeCurly".split('');
        elementTypes[2].name = "openSquare".split('');
        elementTypes[3].name = "closeSquare".split('');
        elementTypes[4].name = "comma".split('');
        elementTypes[5].name = "colon".split('');
        elementTypes[6].name = "nullValue".split('');
        elementTypes[7].name = "trueValue".split('');
        elementTypes[8].name = "falseValue".split('');
        elementTypes[9].name = "string".split('');
        elementTypes[10].name = "number".split('');
        elementTypes[11].name = "end".split('');

        found.booleanValue = false;
        tokenType = new TokenType();
        for (i = 0; i < count && !found.booleanValue; i = i + 1) {
            tokenType = elementTypes[i];
            if (StringsEqual(tokenType.name, elementTypeName)) {
                found.booleanValue = true;
            }
        }

        return tokenType;
    }


    function TokenTypeEnumStructureEquals(a: TokenType, b: TokenType): boolean {
        return StringsEqual(a.name, b.name);
    }


    function TokenTypeEnumEquals(a: string[], b: string[]): boolean {
        var equals: boolean;
        var eta: TokenType, etb: TokenType;
        var founda: BooleanReference, foundb: BooleanReference;

        founda = new BooleanReference();
        foundb = new BooleanReference();

        eta = GetAndCheckTokenType(a, founda);
        etb = GetAndCheckTokenType(b, foundb);

        if (founda.booleanValue && foundb.booleanValue) {
            equals = TokenTypeEnumStructureEquals(eta, etb);
        } else {
            equals = false;
        }

        return equals;
    }


    function JSONCompare(a: string[], b: string[], epsilon: number, equal: BooleanReference, errorMessage: StringArrayReference): boolean {
        var success: boolean;
        var eaRef: ElementReference, ebRef: ElementReference;
        var ea: Elementx, eb: Elementx;

        eaRef = new ElementReference();
        ebRef = new ElementReference();

        success = ReadJSON(a, eaRef, errorMessage);

        if (success) {
            ea = eaRef.element;

            success = ReadJSON(b, ebRef, errorMessage);

            if (success) {
                eb = ebRef.element;

                equal.booleanValue = JSONCompareElements(ea, eb, epsilon);

                DeleteElement(eb);
            }

            DeleteElement(ea);
        }

        return success;
    }


    function JSONCompareElements(ea: Elementx, eb: Elementx, epsilon: number): boolean {
        var equal: boolean;
        var typeName: string[];

        equal = StringsEqual(ea.typex.name, eb.typex.name);

        if (equal) {
            typeName = ea.typex.name;
            if (ElementTypeEnumEquals(typeName, "object".split(''))) {
                equal = JSONCompareObjects(ea.object, eb.object, epsilon);
            } else if (ElementTypeEnumEquals(typeName, "string".split(''))) {
                equal = StringsEqual(ea.stringx, eb.stringx);
            } else if (ElementTypeEnumEquals(typeName, "array".split(''))) {
                equal = JSONCompareArrays(ea.array, eb.array, epsilon);
            } else if (ElementTypeEnumEquals(typeName, "number".split(''))) {
                equal = EpsilonCompare(ea.numberx, eb.numberx, epsilon);
            } else if (ElementTypeEnumEquals(typeName, "nullValue".split(''))) {
                equal = true;
            } else if (ElementTypeEnumEquals(typeName, "booleanValue".split(''))) {
                equal = ea.booleanValue == eb.booleanValue;
            }
        }

        return equal;
    }


    function JSONCompareArrays(ea: Elementx[], eb: Elementx[], epsilon: number): boolean {
        var equals: boolean;
        var i: number, length: number;

        equals = ea.length == eb.length;

        if (equals) {
            length = ea.length;
            for (i = 0; i < length && equals; i = i + 1) {
                equals = JSONCompareElements(ea[i], eb[i], epsilon);
            }
        }

        return equals;
    }


    function JSONCompareObjects(ea: StringElementMap, eb: StringElementMap, epsilon: number): boolean {
        var equals: boolean;
        var akeys: number, bkeys: number, i: number;
        var keys: StringArrayReference;
        var key: string[];
        var aFoundReference: BooleanReference, bFoundReference: BooleanReference;
        var eaValue: Elementx, ebValue: Elementx;

        aFoundReference = new BooleanReference();
        bFoundReference = new BooleanReference();

        akeys = GetStringElementMapNumberOfKeys(ea);
        bkeys = GetStringElementMapNumberOfKeys(eb);

        equals = akeys == bkeys;

        if (equals) {
            keys = GetStringElementMapKeySet(ea);

            for (i = 0; i < keys.stringArray.length && equals; i = i + 1) {
                key = keys.stringArray[i].stringx;

                eaValue = GetObjectValueWithCheck(ea, key, aFoundReference);
                ebValue = GetObjectValueWithCheck(eb, key, bFoundReference);

                if (aFoundReference.booleanValue && bFoundReference.booleanValue) {
                    equals = JSONCompareElements(eaValue, ebValue, epsilon);
                } else {
                    equals = false;
                }
            }
        }

        return equals;
    }


    function GetElementType(elementTypeName: string[]): ElementType {
        var et: ElementType;

        et = new ElementType();
        et.name = elementTypeName;

        return et;
    }


    function GetAndCheckElementType(elementTypeName: string[], found: BooleanReference): ElementType {
        var elementTypes: ElementType[];
        var elementType: ElementType;
        var i: number, antall: number;

        antall = 6;

        elementTypes = [];

        for (i = 0; i < antall; i = i + 1) {
            elementTypes[i] = new ElementType();
        }

        elementTypes[0].name = "object".split('');
        elementTypes[1].name = "array".split('');
        elementTypes[2].name = "string".split('');
        elementTypes[3].name = "number".split('');
        elementTypes[4].name = "booleanValue".split('');
        elementTypes[5].name = "nullValue".split('');

        found.booleanValue = false;
        elementType = new ElementType();
        for (i = 0; i < antall && !found.booleanValue; i = i + 1) {
            elementType = elementTypes[i];
            if (StringsEqual(elementType.name, elementTypeName)) {
                found.booleanValue = true;
            }
        }

        return elementType;
    }


    function ElementTypeStructureEquals(a: ElementType, b: ElementType): boolean {
        return StringsEqual(a.name, b.name);
    }


    function ElementTypeEnumEquals(a: string[], b: string[]): boolean {
        var equals: boolean;
        var eta: ElementType, etb: ElementType;
        var founda: BooleanReference, foundb: BooleanReference;

        founda = new BooleanReference();
        foundb = new BooleanReference();

        eta = GetAndCheckElementType(a, founda);
        etb = GetAndCheckElementType(b, foundb);

        if (founda.booleanValue && foundb.booleanValue) {
            equals = ElementTypeStructureEquals(eta, etb);
        } else {
            equals = false;
        }

        return equals;
    }


    function testEscaper(): number {
        var c: string;
        var letters: NumberReference, failures: NumberReference;
        var mustBeEscaped: boolean;
        var escaped: string[];

        failures = CreateNumberReference(0);
        letters = CreateNumberReference(0);

        c = String.fromCharCode(9);
        mustBeEscaped = JSONMustBeEscaped(c, letters);
        AssertTrue(mustBeEscaped, failures);
        AssertEquals(letters.numberValue, 2, failures);

        escaped = JSONEscapeCharacter(c);
        AssertStringEquals(escaped, "\\t".split(''), failures);

        c = String.fromCharCode(0);
        mustBeEscaped = JSONMustBeEscaped(c, letters);
        AssertTrue(mustBeEscaped, failures);
        AssertEquals(letters.numberValue, 6, failures);

        escaped = JSONEscapeCharacter(c);
        AssertStringEquals(escaped, "\\u0000".split(''), failures);

        return failures.numberValue;
    }


    function mapTo(root: Elementx): Example {
        var example: Example;

        example = new Example();
        example.a = GetObjectValue(root.object, "a".split('')).stringx;
        example.b = mapbTo(GetObjectValue(root.object, "b".split('')).array);
        example.x = mapXTo(GetObjectValue(root.object, "x".split('')).object);

        return example;
    }


    function mapXTo(object: StringElementMap): X {
        var x: X;

        x = new X();

        if (ElementTypeEnumEquals(GetObjectValue(object, "x1".split('')).typex.name, "nullValue".split(''))) {
            x.x1IsNull = true;
            x.x1 = "".split('');
        }

        x.x2 = GetObjectValue(object, "x2".split('')).booleanValue;
        x.x3 = GetObjectValue(object, "x3".split('')).booleanValue;

        return x;
    }


    function mapbTo(array: Elementx[]): number[] {
        var b: number[];
        var i: number;

        b = [];

        for (i = 0; i < array.length; i = i + 1) {
            b[i] = array[i].numberx;
        }

        return b;
    }


    function testWriter(): number {
        var stringx: string[];
        var root: Elementx;
        var example: Example;
        var failures: NumberReference;

        failures = CreateNumberReference(0);

        root = createExampleJSON();

        stringx = WriteJSON(root);

        AssertEquals(stringx.length, 66, failures);

        /* Does not work with Java Maps..*/
        example = mapTo(root);

        AssertStringEquals("hei".split(''), example.a, failures);
        AssertTrue(example.x.x1IsNull, failures);
        AssertTrue(example.x.x2, failures);
        AssertFalse(example.x.x3, failures);
        AssertEquals(1.2, example.b[0], failures);
        AssertEquals(0.1, example.b[1], failures);
        AssertEquals(100, example.b[2], failures);

        DeleteElement(root);

        return failures.numberValue;
    }


    function createExampleJSON(): Elementx {
        var root: Elementx, innerObject: Elementx, array: Elementx;

        root = CreateObjectElement(3);

        innerObject = CreateObjectElement(3);

        SetStringElementMap(innerObject.object, 0, "x1".split(''), CreateNullElement());
        SetStringElementMap(innerObject.object, 1, "x2".split(''), CreateBooleanElement(true));
        SetStringElementMap(innerObject.object, 2, "x3".split(''), CreateBooleanElement(false));

        array = CreateArrayElement(3);
        array.array[0] = CreateNumberElement(1.2);
        array.array[1] = CreateNumberElement(0.1);
        array.array[2] = CreateNumberElement(100);

        SetStringElementMap(root.object, 0, "a".split(''), CreateStringElement("hei".split('')));
        SetStringElementMap(root.object, 1, "b".split(''), array);
        SetStringElementMap(root.object, 2, "x".split(''), innerObject);

        return root;
    }


    function testWriterEscape(): number {
        var stringx: string[];
        var root: Elementx;
        var failures: NumberReference;

        failures = CreateNumberReference(0);

        root = CreateStringElement("\t\n".split(''));

        stringx = WriteJSON(root);

        AssertEquals(stringx.length, 6, failures);

        AssertStringEquals("\"\\t\\n\"".split(''), stringx, failures);

        DeleteElement(root);

        return failures.numberValue;
    }


    function testReader(): number {
        var failures: NumberReference;
        var json: Elementx;
        var stringx: string[], string2: string[];
        var errorMessages: StringArrayReference;
        var elementReference: ElementReference;
        var success: boolean;

        failures = CreateNumberReference(0);

        json = createExampleJSON();
        stringx = WriteJSON(json);
        elementReference = new ElementReference();

        errorMessages = CreateStringArrayReferenceLengthValue(0, "".split(''));

        success = ReadJSON(stringx, elementReference, errorMessages);
        AssertTrue(success, failures);

        if (success) {
            json = elementReference.element;
            string2 = WriteJSON(json);

            AssertEquals(stringx.length, string2.length, failures);
        }

        return failures.numberValue;
    }


    function test2(): number {
        var failures: NumberReference;
        var stringx: string[], string2: string[];
        var errorMessages: StringArrayReference;
        var json: Elementx;
        var elementReference: ElementReference;
        var success: boolean;

        failures = CreateNumberReference(0);

        stringx = strConcatenateString("{".split(''), "\"name\":\"base64\",".split(''));
        stringx = strAppendString(stringx, "\"version\":\"0.1.0\",".split(''));
        stringx = strAppendString(stringx, "\"business namespace\":\"no.inductive.idea10.programs\",".split(''));
        stringx = strAppendString(stringx, "\"scientific namespace\":\"computerscience.algorithms.base64\",".split(''));
        stringx = strAppendString(stringx, "\"imports\":[".split(''));
        stringx = strAppendString(stringx, "],".split(''));
        stringx = strAppendString(stringx, "\"imports2\":{".split(''));
        stringx = strAppendString(stringx, "},".split(''));
        stringx = strAppendString(stringx, "\"development imports\":[".split(''));
        stringx = strAppendString(stringx, "[\"\",\"no.inductive.idea10.programs\",\"arrays\",\"0.1.0\"]".split(''));
        stringx = strAppendString(stringx, "]".split(''));
        stringx = strAppendString(stringx, "}".split(''));

        errorMessages = CreateStringArrayReferenceLengthValue(0, "".split(''));
        elementReference = new ElementReference();
        success = ReadJSON(stringx, elementReference, errorMessages);
        AssertTrue(success, failures);

        if (success) {
            json = elementReference.element;

            string2 = WriteJSON(json);

            AssertEquals(stringx.length, string2.length, failures);
        }

        return failures.numberValue;
    }


    function testReaderExample(): number {
        var json: string[];
        var errorMessages: StringArrayReference;
        var elementReference: ElementReference;
        var outputJSON: StringReference;

        errorMessages = CreateStringArrayReferenceLengthValue(0, "".split(''));
        elementReference = new ElementReference();
        outputJSON = CreateStringReference("".split(''));

        json = "{\"a\":\"hi\",\"b\":[1.2, 0.1, 100],\"x\":{\"x1\":null,\"x2\":true,\"x3\":false}}".split('');

        JSONExample(json, errorMessages, elementReference, outputJSON);

        return 0;
    }


    function JSONExample(json: string[], errorMessages: StringArrayReference, elementReference: ElementReference, outputJSON: StringReference): void {
        var success: boolean;
        var element: Elementx, aElement: Elementx;
        var stringx: string[];
        var array: Elementx[];
        var x: number, y: number, z: number;

		/* The following JSON is in the string json:
           {
             "a": "hi",
             "b": [1.2, 0.1, 100],
             "x": {
               "x1": null,
               "x2": true,
               "x3": false
             }
           }
        */

        /* This functions reads the JSON*/
        success = ReadJSON(json, elementReference, errorMessages);

        /* The return value 'success' is set to true of the parsing succeeds,*/
        /* if not, errorMessages contains the reason.*/
        if (success) {
            /* We can now extract the data structure:*/
            element = elementReference.element;

            /* The following is gets the value "hi" for key "a":*/
            aElement = GetObjectValue(element.object, "a".split(''));
            stringx = aElement.stringx;

            /* The following is gets the array [1.2, 0.1, 100] for key "b":*/
            aElement = GetObjectValue(element.object, "b".split(''));
            array = aElement.array;
            x = array[0].numberx;
            y = array[1].numberx;
            z = array[2].numberx;

            /* This is how you write JSON:*/
            outputJSON.stringx = WriteJSON(element);
        } else {
            /* There was a problem, so we cannot read our data structure.*/
            /* Instead, we can check out the error message.*/
            stringx = errorMessages.stringArray[0].stringx;
        }
    }


    function test(): number {
        var failures: number;

        failures = 0;

        failures = failures + testReader();
        failures = failures + test2();
        failures = failures + testWriter();
        failures = failures + testWriterEscape();
        failures = failures + testTokenizer1();
        failures = failures + testReaderExample();
        failures = failures + testEscaper();
        failures = failures + testValidator();
        failures = failures + testComparator();

        return failures;
    }


    function testValidator(): number {
        var a: string[], b: string[];
        var failures: NumberReference;
        var errorMessages: StringArrayReference;

        failures = CreateNumberReference(0);
        errorMessages = CreateStringArrayReferenceLengthValue(0, "".split(''));

        a = "{\"a\":\"hi\",\"b\":[1.2, 0.1, 100],\"x\":{\"x1\":null,\"x2\":true,\"x3\":false}}".split('');
        b = "{{}}]".split('');

        AssertTrue(IsValidJSON(a, errorMessages), failures);
        AssertFalse(IsValidJSON(b, errorMessages), failures);

        return failures.numberValue;
    }


    function testComparator(): number {
        var a: string[], b: string[];
        var failures: NumberReference;
        var errorMessages: StringArrayReference;
        var equalsReference: BooleanReference;
        var success: boolean;

        failures = CreateNumberReference(0);
        errorMessages = CreateStringArrayReferenceLengthValue(0, "".split(''));
        equalsReference = CreateBooleanReference(false);

        a = "{\"a\":\"hi\",\"b\":[1.2, 0.1, 100],\"x\":{\"x1\":null,\"x2\":true,\"x3\":false}}".split('');
        b = "{\"x\":{\"x1\":null,\"x2\":true,\"x3\":false},\"a\":\"hi\",\"b\":[1.2, 0.1, 100]}".split('');

        success = JSONCompare(a, b, 0.0001, equalsReference, errorMessages);

        AssertTrue(success, failures);
        AssertTrue(equalsReference.booleanValue, failures);

        a = "{\"a\":\"hi\",\"b\":[1.201, 0.1, 100],\"x\":{\"x1\":null,\"x2\":true,\"x3\":false}}".split('');
        b = "{\"x\":{\"x1\":null,\"x2\":true,\"x3\":false},\"a\":\"hi\",\"b\":[1.2, 0.1, 100]}".split('');

        success = JSONCompare(a, b, 0.0001, equalsReference, errorMessages);

        AssertTrue(success, failures);
        AssertFalse(equalsReference.booleanValue, failures);

        success = JSONCompare(a, b, 0.1, equalsReference, errorMessages);

        AssertTrue(success, failures);
        AssertTrue(equalsReference.booleanValue, failures);

        return failures.numberValue;
    }


    function testTokenizer1(): number {
        var failures: NumberReference, countReference: NumberReference, stringLength: NumberReference;
        var errorMessages: StringArrayReference;
        var tokenArrayReference: TokenArrayReference;
        var success: boolean;
        var numbers: StringReference[];
        var i: number;

        failures = CreateNumberReference(0);
        countReference = CreateNumberReference(0);
        stringLength = CreateNumberReference(0);
        errorMessages = CreateStringArrayReferenceLengthValue(0, "".split(''));

        tokenArrayReference = new TokenArrayReference();

        success = JSONTokenize("false".split(''), tokenArrayReference, errorMessages);
        AssertTrue(success, failures);
        if (success) {
            AssertEquals(tokenArrayReference.array.length, 2, failures);
            AssertStringEquals(tokenArrayReference.array[0].typex.name, "falseValue".split(''), failures);
        }

        numbers = strSplitByString("11, -1e-1, -0.123456789e-99, 1E1, -0.1E23".split(''), ", ".split(''));

        for (i = 0; i < numbers.length; i = i + 1) {
            success = JSONTokenize(numbers[i].stringx, tokenArrayReference, errorMessages);
            AssertTrue(success, failures);
            if (success) {
                AssertEquals(tokenArrayReference.array.length, 2, failures);
                AssertStringEquals(tokenArrayReference.array[0].value, numbers[i].stringx, failures);
            }
        }

        success = IsValidJSONStringInJSON("\"\"".split(''), 0, countReference, stringLength, errorMessages);
        AssertTrue(success, failures);
        if (success) {
            AssertEquals(countReference.numberValue, 2, failures);
        }

        success = IsValidJSONString("\"\\u1234\\n\\r\\f\\b\\t\"".split(''), errorMessages);
        AssertTrue(success, failures);

        success = JSONTokenize("\"".split(''), tokenArrayReference, errorMessages);
        AssertFalse(success, failures);

        success = IsValidJSONNumber("1.1-e1".split(''), errorMessages);
        AssertFalse(success, failures);

        success = IsValidJSONNumber("1E+2".split(''), errorMessages);
        AssertTrue(success, failures);

        success = IsValidJSONString("\"\\uAAAG\"".split(''), errorMessages);
        AssertFalse(success, failures);

        return failures.numberValue;
    }


    function CreateBooleanReference(value: boolean): BooleanReference {
        var ref: BooleanReference;
        ref = new BooleanReference();
        ref.booleanValue = value;

        return ref;
    }


    function CreateBooleanArrayReference(value: boolean[]): BooleanArrayReference {
        var ref: BooleanArrayReference;
        ref = new BooleanArrayReference();
        ref.booleanArray = value;

        return ref;
    }


    function CreateBooleanArrayReferenceLengthValue(length: number, value: boolean): BooleanArrayReference {
        var ref: BooleanArrayReference;
        var i: number;
        ref = new BooleanArrayReference();
        ref.booleanArray = [];

        for (i = 0; i < length; i = i + 1) {
            ref.booleanArray[i] = value;
        }

        return ref;
    }


    function FreeBooleanArrayReference(booleanArrayReference: BooleanArrayReference): void {
        delete booleanArrayReference.booleanArray;
        booleanArrayReference = undefined;
    }


    function CreateCharacterReference(value: string): CharacterReference {
        var ref: CharacterReference;
        ref = new CharacterReference();
        ref.characterValue = value;

        return ref;
    }


    function CreateNumberReference(value: number): NumberReference {
        var ref: NumberReference;
        ref = new NumberReference();
        ref.numberValue = value;

        return ref;
    }


    function CreateNumberArrayReference(value: number[]): NumberArrayReference {
        var ref: NumberArrayReference;
        ref = new NumberArrayReference();
        ref.numberArray = value;

        return ref;
    }


    function CreateNumberArrayReferenceLengthValue(length: number, value: number): NumberArrayReference {
        var ref: NumberArrayReference;
        var i: number;
        ref = new NumberArrayReference();
        ref.numberArray = [];

        for (i = 0; i < length; i = i + 1) {
            ref.numberArray[i] = value;
        }

        return ref;
    }


    function FreeNumberArrayReference(numberArrayReference: NumberArrayReference): void {
        delete numberArrayReference.numberArray;
        numberArrayReference = undefined;
    }


    function CreateStringReference(value: string[]): StringReference {
        var ref: StringReference;
        ref = new StringReference();
        ref.stringx = value;

        return ref;
    }


    function CreateStringReferenceLengthValue(length: number, value: string): StringReference {
        var ref: StringReference;
        var i: number;
        ref = new StringReference();
        ref.stringx = [];

        for (i = 0; i < length; i = i + 1) {
            ref.stringx[i] = value;
        }

        return ref;
    }


    function FreeStringReference(stringReference: StringReference): void {
        delete stringReference.stringx;
        stringReference = undefined;
    }


    function CreateStringArrayReference(strings: StringReference[]): StringArrayReference {
        var ref: StringArrayReference;
        ref = new StringArrayReference();
        ref.stringArray = strings;

        return ref;
    }


    function CreateStringArrayReferenceLengthValue(length: number, value: string[]): StringArrayReference {
        var ref: StringArrayReference;
        var i: number;
        ref = new StringArrayReference();
        ref.stringArray = [];

        for (i = 0; i < length; i = i + 1) {
            ref.stringArray[i] = CreateStringReference(value);
        }

        return ref;
    }


    function FreeStringArrayReference(stringArrayReference: StringArrayReference): void {
        var i: number;
        for (i = 0; i < stringArrayReference.stringArray.length; i = i + 1) {
            delete stringArrayReference.stringArray[i];
        }
        delete stringArrayReference.stringArray;
        stringArrayReference = undefined;
    }


    function strWriteStringToStingStream(stream: string[], index: NumberReference, src: string[]): void {
        var i: number;

        for (i = 0; i < src.length; i = i + 1) {
            stream[index.numberValue + i] = src[i];
        }
        index.numberValue = index.numberValue + src.length;
    }


    function strWriteCharacterToStingStream(stream: string[], index: NumberReference, src: string): void {
        stream[index.numberValue] = src;
        index.numberValue = index.numberValue + 1;
    }


    function strWriteBooleanToStingStream(stream: string[], index: NumberReference, src: boolean): void {
        if (src) {
            strWriteStringToStingStream(stream, index, "true".split(''));
        } else {
            strWriteStringToStingStream(stream, index, "false".split(''));
        }
    }


    function strSubstringWithCheck(stringx: string[], fromx: number, to: number, stringReference: StringReference): boolean {
        var success: boolean;

        if (fromx >= 0 && fromx <= stringx.length && to >= 0 && to <= stringx.length && fromx <= to) {
            stringReference.stringx = strSubstring(stringx, fromx, to);
            success = true;
        } else {
            success = false;
        }

        return success;
    }


    function strSubstring(stringx: string[], fromx: number, to: number): string[] {
        var n: string[];
        var i: number, length: number;

        length = to - fromx;

        n = [];

        for (i = fromx; i < to; i = i + 1) {
            n[i - fromx] = stringx[i];
        }

        return n;
    }


    function strAppendString(s1: string[], s2: string[]): string[] {
        var newString: string[];

        newString = strConcatenateString(s1, s2);

        s1 = undefined;

        return newString;
    }


    function strConcatenateString(s1: string[], s2: string[]): string[] {
        var newString: string[];
        var i: number;

        newString = [];

        for (i = 0; i < s1.length; i = i + 1) {
            newString[i] = s1[i];
        }

        for (i = 0; i < s2.length; i = i + 1) {
            newString[s1.length + i] = s2[i];
        }

        return newString;
    }


    function strAppendCharacter(stringx: string[], c: string): string[] {
        var newString: string[];

        newString = strConcatenateCharacter(stringx, c);

        stringx = undefined;

        return newString;
    }


    function strConcatenateCharacter(stringx: string[], c: string): string[] {
        var newString: string[];
        var i: number;
        newString = [];

        for (i = 0; i < stringx.length; i = i + 1) {
            newString[i] = stringx[i];
        }

        newString[stringx.length] = c;

        return newString;
    }


    function strSplitByCharacter(toSplit: string[], splitBy: string): StringReference[] {
        var split: StringReference[];
        var stringToSplitBy: string[];

        stringToSplitBy = [];
        stringToSplitBy[0] = splitBy;

        split = strSplitByString(toSplit, stringToSplitBy);

        stringToSplitBy = undefined;

        return split;
    }


    function strIndexOfCharacter(stringx: string[], character: string, indexReference: NumberReference): boolean {
        var i: number;
        var found: boolean;

        found = false;
        for (i = 0; i < stringx.length && !found; i = i + 1) {
            if (stringx[i] == character) {
                found = true;
                indexReference.numberValue = i;
            }
        }

        return found;
    }


    function strSubstringEqualsWithCheck(stringx: string[], fromx: number, substring: string[], equalsReference: BooleanReference): boolean {
        var success: boolean;

        if (fromx < stringx.length) {
            success = true;
            equalsReference.booleanValue = strSubstringEquals(stringx, fromx, substring);
        } else {
            success = false;
        }

        return success;
    }


    function strSubstringEquals(stringx: string[], fromx: number, substring: string[]): boolean {
        var i: number;
        var equal: boolean;

        equal = true;
        for (i = 0; i < substring.length && equal; i = i + 1) {
            if (stringx[fromx + i] != substring[i]) {
                equal = false;
            }
        }

        return equal;
    }


    function strIndexOfString(stringx: string[], substring: string[], indexReference: NumberReference): boolean {
        var i: number;
        var found: boolean;

        found = false;
        for (i = 0; i < stringx.length - substring.length + 1 && !found; i = i + 1) {
            if (strSubstringEquals(stringx, i, substring)) {
                found = true;
                indexReference.numberValue = i;
            }
        }

        return found;
    }


    function strContainsCharacter(stringx: string[], character: string): boolean {
        var i: number;
        var found: boolean;

        found = false;
        for (i = 0; i < stringx.length && !found; i = i + 1) {
            if (stringx[i] == character) {
                found = true;
            }
        }

        return found;
    }


    function strContainsString(stringx: string[], substring: string[]): boolean {
        return strIndexOfString(stringx, substring, new NumberReference());
    }


    function strToUpperCase(stringx: string[]): void {
        var i: number;

        for (i = 0; i < stringx.length; i = i + 1) {
            stringx[i] = charToUpperCase(stringx[i]);
        }
    }


    function strToLowerCase(stringx: string[]): void {
        var i: number;

        for (i = 0; i < stringx.length; i = i + 1) {
            stringx[i] = charToLowerCase(stringx[i]);
        }
    }


    function strEqualsIgnoreCase(a: string[], b: string[]): boolean {
        var equal: boolean;
        var i: number;

        if (a.length == b.length) {
            equal = true;
            for (i = 0; i < a.length && equal; i = i + 1) {
                if (charToLowerCase(a[i]) != charToLowerCase(b[i])) {
                    equal = false;
                }
            }
        } else {
            equal = false;
        }

        return equal;
    }


    function strReplaceString(stringx: string[], toReplace: string[], replaceWith: string[]): string[] {
        var result: string[];
        var i: number;
        var equalsReference: BooleanReference;
        var success: boolean;

        equalsReference = new BooleanReference();
        result = [];

        for (i = 0; i < stringx.length;) {
            success = strSubstringEqualsWithCheck(stringx, i, toReplace, equalsReference);
            if (success) {
                success = equalsReference.booleanValue;
            }

            if (success && toReplace.length > 0) {
                result = strConcatenateString(result, replaceWith);
                i = i + toReplace.length;
            } else {
                result = strConcatenateCharacter(result, stringx[i]);
                i = i + 1;
            }
        }

        return result;
    }


    function strReplaceCharacter(stringx: string[], toReplace: string, replaceWith: string): string[] {
        var result: string[];
        var i: number;

        result = [];

        for (i = 0; i < stringx.length; i = i + 1) {
            if (stringx[i] == toReplace) {
                result = strConcatenateCharacter(result, replaceWith);
            } else {
                result = strConcatenateCharacter(result, stringx[i]);
            }
        }

        return result;
    }


    function strTrim(stringx: string[]): string[] {
        var result: string[];
        var i: number, lastWhitespaceLocationStart: number, lastWhitespaceLocationEnd: number;
        var firstNonWhitespaceFound: boolean;

        /* Find whitepaces at the start.*/
        lastWhitespaceLocationStart = -1;
        firstNonWhitespaceFound = false;
        for (i = 0; i < stringx.length && !firstNonWhitespaceFound; i = i + 1) {
            if (charIsWhiteSpace(stringx[i])) {
                lastWhitespaceLocationStart = i;
            } else {
                firstNonWhitespaceFound = true;
            }
        }

        /* Find whitepaces at the end.*/
        lastWhitespaceLocationEnd = stringx.length;
        firstNonWhitespaceFound = false;
        for (i = stringx.length - 1; i >= 0 && !firstNonWhitespaceFound; i = i - 1) {
            if (charIsWhiteSpace(stringx[i])) {
                lastWhitespaceLocationEnd = i;
            } else {
                firstNonWhitespaceFound = true;
            }
        }

        if (lastWhitespaceLocationStart < lastWhitespaceLocationEnd) {
            result = strSubstring(stringx, lastWhitespaceLocationStart + 1, lastWhitespaceLocationEnd);
        } else {
            result = [];
        }

        return result;
    }


    function strStartsWith(stringx: string[], start: string[]): boolean {
        var startsWithString: boolean;

        startsWithString = false;
        if (stringx.length >= start.length) {
            startsWithString = strSubstringEquals(stringx, 0, start);
        }

        return startsWithString;
    }


    function strEndsWith(stringx: string[], end: string[]): boolean {
        var endsWithString: boolean;

        endsWithString = false;
        if (stringx.length >= end.length) {
            endsWithString = strSubstringEquals(stringx, stringx.length - end.length, end);
        }

        return endsWithString;
    }


    function strSplitByString(toSplit: string[], splitBy: string[]): StringReference[] {
        var split: StringReference[];
        var next: string[];
        var i: number;
        var c: string;
        var n: StringReference;

        split = [];

        next = [];
        for (i = 0; i < toSplit.length;) {
            c = toSplit[i];

            if (strSubstringEquals(toSplit, i, splitBy)) {
                if (split.length != 0 || i != 0) {
                    n = new StringReference();
                    n.stringx = next;
                    split = AddString(split, n);
                    next = [];
                    i = i + splitBy.length;
                }
            } else {
                next = strAppendCharacter(next, c);
                i = i + 1;
            }
        }

        if (next.length > 0) {
            n = new StringReference();
            n.stringx = next;
            split = AddString(split, n);
        }

        return split;
    }


    function nCreateStringScientificNotationDecimalFromNumber(decimal: number): string[] {
        var mantissaReference: StringReference, exponentReference: StringReference;
        var multiplier: number, inc: number;
        var exponent: number;
        var done: boolean, isPositive: boolean;
        var result: string[];
        mantissaReference = new StringReference();
        exponentReference = new StringReference();
        result = [];
        done = false;
        exponent = 0;

        if (decimal < 0) {
            isPositive = false;
            decimal = -decimal;
        } else {
            isPositive = true;
        }

        if (decimal == 0) {
            done = true;
        }

        if (!done) {
            multiplier = 0;
            inc = 0;
            if (decimal < 1) {
                multiplier = 10;
                inc = -1;
            } else if (decimal >= 10) {
                multiplier = 0.1;
                inc = 1;
            } else {
                done = true;
            }
            if (!done) {
                for (; decimal >= 10 || decimal < 1;) {
                    decimal = decimal * multiplier;
                    exponent = exponent + inc;
                }
            }
        }

        nCreateStringFromNumberWithCheck(decimal, 10, mantissaReference);

        nCreateStringFromNumberWithCheck(exponent, 10, exponentReference);

        if (!isPositive) {
            result = AppendString(result, "-".split(''));
        }

        result = AppendString(result, mantissaReference.stringx);
        result = AppendString(result, "e".split(''));
        result = AppendString(result, exponentReference.stringx);

        return result;
    }


    function nCreateStringDecimalFromNumber(decimal: number): string[] {
        var stringReference: StringReference;
        stringReference = new StringReference();

        /* This will succeed because base = 10.*/
        nCreateStringFromNumberWithCheck(decimal, 10, stringReference);

        return stringReference.stringx;
    }


    function nCreateStringFromNumberWithCheck(decimal: number, base: number, stringReference: StringReference): boolean {
        var stringx: string[];
        var maximumDigits: number;
        var digitPosition: number;
        var hasPrintedPoint: boolean, isPositive: boolean;
        var i: number, d: number;
        var success: boolean;
        var characterReference: CharacterReference;
        var c: string;
        isPositive = true;

        if (decimal < 0) {
            isPositive = false;
            decimal = -decimal;
        }

        if (decimal == 0) {
            stringReference.stringx = "0".split('');
            success = true;
        } else {
            characterReference = new CharacterReference();
            if (IsInteger(base)) {
                success = true;
                stringx = [];
                maximumDigits = nGetMaximumDigitsForBase(base);
                digitPosition = nGetFirstDigitPosition(decimal, base);
                decimal = Math.round(decimal * base ** (maximumDigits - digitPosition - 1));
                hasPrintedPoint = false;
                if (!isPositive) {
                    stringx = AppendCharacter(stringx, '-');
                }
                if (digitPosition < 0) {
                    stringx = AppendCharacter(stringx, '0');
                    stringx = AppendCharacter(stringx, '.');
                    hasPrintedPoint = true;
                    for (i = 0; i < -digitPosition - 1; i = i + 1) {
                        stringx = AppendCharacter(stringx, '0');
                    }
                }
                for (i = 0; i < maximumDigits && success; i = i + 1) {
                    d = Math.floor(decimal / base ** (maximumDigits - i - 1));
                    if (d >= base) {
                        d = base - 1;
                    }
                    if (!hasPrintedPoint && digitPosition - i + 1 == 0) {
                        if (decimal != 0) {
                            stringx = AppendCharacter(stringx, '.');
                        }
                        hasPrintedPoint = true;
                    }
                    if (decimal == 0 && hasPrintedPoint) {
                    } else {
                        success = nGetSingleDigitCharacterFromNumberWithCheck(d, base, characterReference);
                        if (success) {
                            c = characterReference.characterValue;
                            stringx = AppendCharacter(stringx, c);
                        }
                    }
                    if (success) {
                        decimal = decimal - d * base ** (maximumDigits - i - 1);
                    }
                }
                if (success) {
                    for (i = 0; i < digitPosition - maximumDigits + 1; i = i + 1) {
                        stringx = AppendCharacter(stringx, '0');
                    }
                    stringReference.stringx = stringx;
                }
            } else {
                success = false;
            }
        }

        /* Done*/
        return success;
    }


    function nGetMaximumDigitsForBase(base: number): number {
        var t: number;
        t = 10 ** 15;
        return Math.floor(Math.log(t) / Math.log(base));
    }


    function nGetFirstDigitPosition(decimal: number, base: number): number {
        var power: number;
        var t: number;
        power = Math.ceil(Math.log(decimal) / Math.log(base));

        t = decimal * base ** (-power);
        if (t < base && t >= 1) {
        } else if (t >= base) {
            power = power + 1;
        } else if (t < 1) {
            power = power - 1;
        }

        return power;
    }


    function nGetSingleDigitCharacterFromNumberWithCheck(c: number, base: number, characterReference: CharacterReference): boolean {
        var numberTable: string[];
        var success: boolean;
        numberTable = nGetDigitCharacterTable();

        if (c < base || c < numberTable.length) {
            success = true;
            characterReference.characterValue = numberTable[c];
        } else {
            success = false;
        }

        return success;
    }


    function nGetDigitCharacterTable(): string[] {
        var numberTable: string[];
        numberTable = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

        return numberTable;
    }


    function nCreateNumberFromDecimalStringWithCheck(stringx: string[], decimalReference: NumberReference, errorMessage: StringReference): boolean {
        return nCreateNumberFromStringWithCheck(stringx, 10, decimalReference, errorMessage);
    }


    function nCreateNumberFromDecimalString(stringx: string[]): number {
        var doubleReference: NumberReference;
        var stringReference: StringReference;
        var numberx: number;
        doubleReference = CreateNumberReference(0);
        stringReference = CreateStringReference("".split(''));
        nCreateNumberFromStringWithCheck(stringx, 10, doubleReference, stringReference);
        numberx = doubleReference.numberValue;

        doubleReference = undefined;
        stringReference = undefined;

        return numberx;
    }


    function nCreateNumberFromStringWithCheck(stringx: string[], base: number, numberReference: NumberReference, errorMessage: StringReference): boolean {
        var success: boolean;
        var numberIsPositive: BooleanReference, exponentIsPositive: BooleanReference;
        var beforePoint: NumberArrayReference, afterPoint: NumberArrayReference, exponent: NumberArrayReference;
        numberIsPositive = CreateBooleanReference(true);
        exponentIsPositive = CreateBooleanReference(true);
        beforePoint = new NumberArrayReference();
        afterPoint = new NumberArrayReference();
        exponent = new NumberArrayReference();

        if (base >= 2 && base <= 36) {
            success = nExtractPartsFromNumberString(stringx, base, numberIsPositive, beforePoint, afterPoint, exponentIsPositive, exponent, errorMessage);
            if (success) {
                numberReference.numberValue = nCreateNumberFromParts(base, numberIsPositive.booleanValue, beforePoint.numberArray, afterPoint.numberArray, exponentIsPositive.booleanValue, exponent.numberArray);
            }
        } else {
            success = false;
            errorMessage.stringx = "Base must be from 2 to 36.".split('');
        }

        return success;
    }


    function nCreateNumberFromParts(base: number, numberIsPositive: boolean, beforePoint: number[], afterPoint: number[], exponentIsPositive: boolean, exponent: number[]): number {
        var n: number, i: number, p: number, e: number;
        n = 0;

        for (i = 0; i < beforePoint.length; i = i + 1) {
            p = beforePoint[beforePoint.length - i - 1];
            n = n + p * base ** i;
        }

        for (i = 0; i < afterPoint.length; i = i + 1) {
            p = afterPoint[i];
            n = n + p * base ** (-(i + 1));
        }

        if (exponent.length > 0) {
            e = 0;
            for (i = 0; i < exponent.length; i = i + 1) {
                p = exponent[exponent.length - i - 1];
                e = e + p * base ** i;
            }
            if (!exponentIsPositive) {
                e = -e;
            }
            n = n * base ** e;
        }

        if (!numberIsPositive) {
            n = -n;
        }

        return n;
    }


    function nExtractPartsFromNumberString(n: string[], base: number, numberIsPositive: BooleanReference, beforePoint: NumberArrayReference, afterPoint: NumberArrayReference, exponentIsPositive: BooleanReference, exponent: NumberArrayReference, errorMessages: StringReference): boolean {
        var i: number;
        var success: boolean;
        i = 0;

        if (i < n.length) {
            if (n[i] == '-') {
                numberIsPositive.booleanValue = false;
                i = i + 1;
            } else if (n[i] == '+') {
                numberIsPositive.booleanValue = true;
                i = i + 1;
            }
            success = nExtractPartsFromNumberStringFromSign(n, base, i, beforePoint, afterPoint, exponentIsPositive, exponent, errorMessages);
        } else {
            success = false;
            errorMessages.stringx = "Number cannot have length zero.".split('');
        }

        return success;
    }


    function nExtractPartsFromNumberStringFromSign(n: string[], base: number, i: number, beforePoint: NumberArrayReference, afterPoint: NumberArrayReference, exponentIsPositive: BooleanReference, exponent: NumberArrayReference, errorMessages: StringReference): boolean {
        var success: boolean, done: boolean;
        var count: number, j: number;
        done = false;
        count = 0;
        for (; i + count < n.length && !done;) {
            if (nCharacterIsNumberCharacterInBase(n[i + count], base)) {
                count = count + 1;
            } else {
                done = true;
            }
        }

        if (count >= 1) {
            beforePoint.numberArray = [];
            for (j = 0; j < count; j = j + 1) {
                beforePoint.numberArray[j] = nGetNumberFromNumberCharacterForBase(n[i + j], base);
            }
            i = i + count;
            if (i < n.length) {
                success = nExtractPartsFromNumberStringFromPointOrExponent(n, base, i, afterPoint, exponentIsPositive, exponent, errorMessages);
            } else {
                afterPoint.numberArray = [];
                exponent.numberArray = [];
                success = true;
            }
        } else {
            success = false;
            errorMessages.stringx = "Number must have at least one number after the optional sign.".split('');
        }

        return success;
    }


    function nExtractPartsFromNumberStringFromPointOrExponent(n: string[], base: number, i: number, afterPoint: NumberArrayReference, exponentIsPositive: BooleanReference, exponent: NumberArrayReference, errorMessages: StringReference): boolean {
        var success: boolean, done: boolean;
        var count: number, j: number;
        if (n[i] == '.') {
            i = i + 1;
            if (i < n.length) {
                done = false;
                count = 0;
                for (; i + count < n.length && !done;) {
                    if (nCharacterIsNumberCharacterInBase(n[i + count], base)) {
                        count = count + 1;
                    } else {
                        done = true;
                    }
                }
                if (count >= 1) {
                    afterPoint.numberArray = [];
                    for (j = 0; j < count; j = j + 1) {
                        afterPoint.numberArray[j] = nGetNumberFromNumberCharacterForBase(n[i + j], base);
                    }
                    i = i + count;
                    if (i < n.length) {
                        success = nExtractPartsFromNumberStringFromExponent(n, base, i, exponentIsPositive, exponent, errorMessages);
                    } else {
                        exponent.numberArray = [];
                        success = true;
                    }
                } else {
                    success = false;
                    errorMessages.stringx = "There must be at least one digit after the decimal point.".split('');
                }
            } else {
                success = false;
                errorMessages.stringx = "There must be at least one digit after the decimal point.".split('');
            }
        } else if (base <= 14 && (n[i] == 'e' || n[i] == 'E')) {
            if (i < n.length) {
                success = nExtractPartsFromNumberStringFromExponent(n, base, i, exponentIsPositive, exponent, errorMessages);
                afterPoint.numberArray = [];
            } else {
                success = false;
                errorMessages.stringx = "There must be at least one digit after the exponent.".split('');
            }
        } else {
            success = false;
            errorMessages.stringx = "Expected decimal point or exponent symbol.".split('');
        }

        return success;
    }


    function nExtractPartsFromNumberStringFromExponent(n: string[], base: number, i: number, exponentIsPositive: BooleanReference, exponent: NumberArrayReference, errorMessages: StringReference): boolean {
        var success: boolean, done: boolean;
        var count: number, j: number;
        if (base <= 14 && (n[i] == 'e' || n[i] == 'E')) {
            i = i + 1;
            if (i < n.length) {
                if (n[i] == '-') {
                    exponentIsPositive.booleanValue = false;
                    i = i + 1;
                } else if (n[i] == '+') {
                    exponentIsPositive.booleanValue = true;
                    i = i + 1;
                }
                if (i < n.length) {
                    done = false;
                    count = 0;
                    for (; i + count < n.length && !done;) {
                        if (nCharacterIsNumberCharacterInBase(n[i + count], base)) {
                            count = count + 1;
                        } else {
                            done = true;
                        }
                    }
                    if (count >= 1) {
                        exponent.numberArray = [];
                        for (j = 0; j < count; j = j + 1) {
                            exponent.numberArray[j] = nGetNumberFromNumberCharacterForBase(n[i + j], base);
                        }
                        i = i + count;
                        if (i == n.length) {
                            success = true;
                        } else {
                            success = false;
                            errorMessages.stringx = "There cannot be any characters past the exponent of the number.".split('');
                        }
                    } else {
                        success = false;
                        errorMessages.stringx = "There must be at least one digit after the decimal point.".split('');
                    }
                } else {
                    success = false;
                    errorMessages.stringx = "There must be at least one digit after the exponent symbol.".split('');
                }
            } else {
                success = false;
                errorMessages.stringx = "There must be at least one digit after the exponent symbol.".split('');
            }
        } else {
            success = false;
            errorMessages.stringx = "Expected exponent symbol.".split('');
        }

        return success;
    }


    function nGetNumberFromNumberCharacterForBase(c: string, base: number): number {
        var numberTable: string[];
        var i: number;
        var position: number;
        numberTable = nGetDigitCharacterTable();
        position = 0;

        for (i = 0; i < base; i = i + 1) {
            if (numberTable[i] == c) {
                position = i;
            }
        }

        return position;
    }


    function nCharacterIsNumberCharacterInBase(c: string, base: number): boolean {
        var numberTable: string[];
        var i: number;
        var found: boolean;
        numberTable = nGetDigitCharacterTable();
        found = false;

        for (i = 0; i < base; i = i + 1) {
            if (numberTable[i] == c) {
                found = true;
            }
        }

        return found;
    }


    function nStringToNumberArray(str: string[]): number[] {
        var numberArrayReference: NumberArrayReference;
        var stringReference: StringReference;
        var numbers: number[];
        numberArrayReference = new NumberArrayReference();
        stringReference = new StringReference();

        nStringToNumberArrayWithCheck(str, numberArrayReference, stringReference);

        numbers = numberArrayReference.numberArray;

        numberArrayReference = undefined;
        stringReference = undefined;

        return numbers;
    }


    function nStringToNumberArrayWithCheck(str: string[], numberArrayReference: NumberArrayReference, errorMessage: StringReference): boolean {
        var numberStrings: StringReference[];
        var numbers: number[];
        var i: number;
        var numberString: string[], trimmedNumberString: string[];
        var success: boolean;
        var numberReference: NumberReference;
        numberStrings = SplitByString(str, ",".split(''));

        numbers = [];
        success = true;
        numberReference = new NumberReference();

        for (i = 0; i < numberStrings.length; i = i + 1) {
            numberString = numberStrings[i].stringx;
            trimmedNumberString = Trim(numberString);
            success = nCreateNumberFromDecimalStringWithCheck(trimmedNumberString, numberReference, errorMessage);
            numbers[i] = numberReference.numberValue;
            FreeStringReference(numberStrings[i]);
            trimmedNumberString = undefined;
        }

        numberStrings = undefined;
        numberReference = undefined;

        numberArrayReference.numberArray = numbers;

        return success;
    }


    function AddNumber(list: number[], a: number): number[] {
        var newlist: number[];
        var i: number;

        newlist = [];
        for (i = 0; i < list.length; i = i + 1) {
            newlist[i] = list[i];
        }
        newlist[list.length] = a;

        list = undefined;

        return newlist;
    }


    function AddNumberRef(list: NumberArrayReference, i: number): void {
        list.numberArray = AddNumber(list.numberArray, i);
    }


    function RemoveNumber(list: number[], n: number): number[] {
        var newlist: number[];
        var i: number;

        newlist = [];

        if (n >= 0 && n < list.length) {
            for (i = 0; i < list.length; i = i + 1) {
                if (i < n) {
                    newlist[i] = list[i];
                }
                if (i > n) {
                    newlist[i - 1] = list[i];
                }
            }

            list = undefined;
        } else {
            newlist = undefined;
        }

        return newlist;
    }


    function GetNumberRef(list: NumberArrayReference, i: number): number {
        return list.numberArray[i];
    }


    function RemoveNumberRef(list: NumberArrayReference, i: number): void {
        list.numberArray = RemoveNumber(list.numberArray, i);
    }


    function AddString(list: StringReference[], a: StringReference): StringReference[] {
        var newlist: StringReference[];
        var i: number;

        newlist = [];

        for (i = 0; i < list.length; i = i + 1) {
            newlist[i] = list[i];
        }
        newlist[list.length] = a;

        list = undefined;

        return newlist;
    }


    function AddStringRef(list: StringArrayReference, i: StringReference): void {
        list.stringArray = AddString(list.stringArray, i);
    }


    function RemoveString(list: StringReference[], n: number): StringReference[] {
        var newlist: StringReference[];
        var i: number;

        newlist = [];

        if (n >= 0 && n < list.length) {
            for (i = 0; i < list.length; i = i + 1) {
                if (i < n) {
                    newlist[i] = list[i];
                }
                if (i > n) {
                    newlist[i - 1] = list[i];
                }
            }

            list = undefined;
        } else {
            newlist = undefined;
        }

        return newlist;
    }


    function GetStringRef(list: StringArrayReference, i: number): StringReference {
        return list.stringArray[i];
    }


    function RemoveStringRef(list: StringArrayReference, i: number): void {
        list.stringArray = RemoveString(list.stringArray, i);
    }


    function AddBoolean(list: boolean[], a: boolean): boolean[] {
        var newlist: boolean[];
        var i: number;

        newlist = [];
        for (i = 0; i < list.length; i = i + 1) {
            newlist[i] = list[i];
        }
        newlist[list.length] = a;

        list = undefined;

        return newlist;
    }


    function AddBooleanRef(list: BooleanArrayReference, i: boolean): void {
        list.booleanArray = AddBoolean(list.booleanArray, i);
    }


    function RemoveBoolean(list: boolean[], n: number): boolean[] {
        var newlist: boolean[];
        var i: number;

        newlist = [];

        if (n >= 0 && n < list.length) {
            for (i = 0; i < list.length; i = i + 1) {
                if (i < n) {
                    newlist[i] = list[i];
                }
                if (i > n) {
                    newlist[i - 1] = list[i];
                }
            }

            list = undefined;
        } else {
            newlist = undefined;
        }

        return newlist;
    }


    function GetBooleanRef(list: BooleanArrayReference, i: number): boolean {
        return list.booleanArray[i];
    }


    function RemoveDecimalRef(list: BooleanArrayReference, i: number): void {
        list.booleanArray = RemoveBoolean(list.booleanArray, i);
    }


    function AddCharacter(list: string[], a: string): string[] {
        var newlist: string[];
        var i: number;

        newlist = [];
        for (i = 0; i < list.length; i = i + 1) {
            newlist[i] = list[i];
        }
        newlist[list.length] = a;

        list = undefined;

        return newlist;
    }


    function AddCharacterRef(list: StringReference, i: string): void {
        list.stringx = AddCharacter(list.stringx, i);
    }


    function RemoveCharacter(list: string[], n: number): string[] {
        var newlist: string[];
        var i: number;

        newlist = [];

        if (n >= 0 && n < list.length) {
            for (i = 0; i < list.length; i = i + 1) {
                if (i < n) {
                    newlist[i] = list[i];
                }
                if (i > n) {
                    newlist[i - 1] = list[i];
                }
            }

            list = undefined;
        } else {
            newlist = undefined;
        }

        return newlist;
    }


    function GetCharacterRef(list: StringReference, i: number): string {
        return list.stringx[i];
    }


    function RemoveCharacterRef(list: StringReference, i: number): void {
        list.stringx = RemoveCharacter(list.stringx, i);
    }


    function Negate(x: number): number {
        return -x;
    }


    function Positive(x: number): number {
        return +x;
    }


    function Factorial(x: number): number {
        var i: number, f: number;
        f = 1;

        for (i = 2; i <= x; i = i + 1) {
            f = f * i;
        }

        return f;
    }


    function Round(x: number): number {
        return Math.floor(x + 0.5);
    }


    function BankersRound(x: number): number {
        var r: number;
        if (Absolute(x - Truncate(x)) == 0.5) {
            if (!DivisibleBy(Round(x), 2)) {
                r = Round(x) - 1;
            } else {
                r = Round(x);
            }
        } else {
            r = Round(x);
        }

        return r;
    }


    function Ceil(x: number): number {
        return Math.ceil(x);
    }


    function Floor(x: number): number {
        return Math.floor(x);
    }


    function Truncate(x: number): number {
        var t: number;
        if (x >= 0) {
            t = Math.floor(x);
        } else {
            t = Math.ceil(x);
        }

        return t;
    }


    function Absolute(x: number): number {
        return Math.abs(x);
    }


    function Logarithm(x: number): number {
        return Math.log10(x);
    }


    function NaturalLogarithm(x: number): number {
        return Math.log(x);
    }


    function Sin(x: number): number {
        return Math.sin(x);
    }


    function Cos(x: number): number {
        return Math.cos(x);
    }


    function Tan(x: number): number {
        return Math.tan(x);
    }


    function Asin(x: number): number {
        return Math.asin(x);
    }


    function Acos(x: number): number {
        return Math.acos(x);
    }


    function Atan(x: number): number {
        return Math.atan(x);
    }


    function Atan2(y: number, x: number): number {
        var a: number;
        a = 0;

        if (x > 0) {
            a = Atan(y / x);
        } else if (x < 0 && y >= 0) {
            a = Atan(y / x) + Math.PI;
        } else if (x < 0 && y < 0) {
            a = Atan(y / x) - Math.PI;
        } else if (x == 0 && y > 0) {
            a = Math.PI / 2;
        } else if (x == 0 && y < 0) {
            a = -Math.PI / 2;
        }

        return a;
    }


    function Squareroot(x: number): number {
        return Math.sqrt(x);
    }


    function Exp(x: number): number {
        return Math.exp(x);
    }


    function DivisibleBy(a: number, b: number): boolean {
        return ((a % b) == 0);
    }


    function Combinations(n: number, k: number): number {
        return Factorial(n) / (Factorial(n - k) * Factorial(k));
    }


    function EpsilonCompareApproximateDigits(a: number, b: number, digits: number): boolean {
        var ad: number, bd: number, d: number, epsilon: number;
        var ret: boolean;
        if (a < 0 && b < 0 || a > 0 && b > 0) {
            if (a < 0 && b < 0) {
                a = -a;
                b = -b;
            }
            ad = Math.log10(a);
            bd = Math.log10(b);
            d = Math.max(ad, bd);
            epsilon = 10 ** (d - digits);
            ret = Math.abs(a - b) > epsilon;
        } else {
            ret = false;
        }

        return ret;
    }


    function EpsilonCompare(a: number, b: number, epsilon: number): boolean {
        return Math.abs(a - b) < epsilon;
    }


    function GreatestCommonDivisor(a: number, b: number): number {
        var t: number;
        for (; b != 0;) {
            t = b;
            b = a % b;
            a = t;
        }

        return a;
    }


    function IsInteger(a: number): boolean {
        return (a - Math.floor(a)) == 0;
    }


    function GreatestCommonDivisorWithCheck(a: number, b: number, gcdReference: NumberReference): boolean {
        var success: boolean;
        var gcd: number;
        if (IsInteger(a) && IsInteger(b)) {
            gcd = GreatestCommonDivisor(a, b);
            gcdReference.numberValue = gcd;
            success = true;
        } else {
            success = false;
        }


        return success;
    }

    function LeastCommonMultiple(a: number, b: number): number {
        var lcm: number;
        if (a > 0 && b > 0) {
            lcm = Math.abs(a * b) / GreatestCommonDivisor(a, b);
        } else {
            lcm = 0;
        }

        return lcm;
    }


    function Sign(a: number): number {
        var s: number;
        if (a > 0) {
            s = 1;
        } else if (a < 0) {
            s = -1;
        } else {
            s = 0;
        }

        return s;
    }


    function Max(a: number, b: number): number {
        return Math.max(a, b);
    }


    function Min(a: number, b: number): number {
        return Math.min(a, b);
    }


    function Power(a: number, b: number): number {
        return a ** b;
    }


    function StringToNumberArray(stringx: string[]): number[] {
        var i: number;
        var array: number[];

        array = [];

        for (i = 0; i < stringx.length; i = i + 1) {
            array[i] = stringx[i].charCodeAt(0);
        }
        return array;
    }


    function NumberArrayToString(array: number[]): string[] {
        var i: number;
        var stringx: string[];

        stringx = [];

        for (i = 0; i < array.length; i = i + 1) {
            stringx[i] = String.fromCharCode(array[i]);
        }
        return stringx;
    }


    function NumberArraysEqual(a: number[], b: number[]): boolean {
        var equal: boolean;
        var i: number;

        equal = true;
        if (a.length == b.length) {
            for (i = 0; i < a.length && equal; i = i + 1) {
                if (a[i] != b[i]) {
                    equal = false;
                }
            }
        } else {
            equal = false;
        }

        return equal;
    }


    function BooleanArraysEqual(a: boolean[], b: boolean[]): boolean {
        var equal: boolean;
        var i: number;

        equal = true;
        if (a.length == b.length) {
            for (i = 0; i < a.length && equal; i = i + 1) {
                if (a[i] != b[i]) {
                    equal = false;
                }
            }
        } else {
            equal = false;
        }

        return equal;
    }


    function StringsEqual(a: string[], b: string[]): boolean {
        var equal: boolean;
        var i: number;

        equal = true;
        if (a.length == b.length) {
            for (i = 0; i < a.length && equal; i = i + 1) {
                if (a[i] != b[i]) {
                    equal = false;
                }
            }
        } else {
            equal = false;
        }

        return equal;
    }


    function FillNumberArray(a: number[], value: number): void {
        var i: number;

        for (i = 0; i < a.length; i = i + 1) {
            a[i] = value;
        }
    }


    function FillString(a: string[], value: string): void {
        var i: number;

        for (i = 0; i < a.length; i = i + 1) {
            a[i] = value;
        }
    }


    function FillBooleanArray(a: boolean[], value: boolean): void {
        var i: number;

        for (i = 0; i < a.length; i = i + 1) {
            a[i] = value;
        }
    }


    function FillNumberArrayRange(a: number[], value: number, fromx: number, to: number): boolean {
        var i: number, length: number;
        var success: boolean;

        if (fromx >= 0 && fromx <= a.length && to >= 0 && to <= a.length && fromx <= to) {
            length = to - fromx;
            for (i = 0; i < length; i = i + 1) {
                a[fromx + i] = value;
            }

            success = true;
        } else {
            success = false;
        }

        return success;
    }


    function FillBooleanArrayRange(a: boolean[], value: boolean, fromx: number, to: number): boolean {
        var i: number, length: number;
        var success: boolean;

        if (fromx >= 0 && fromx <= a.length && to >= 0 && to <= a.length && fromx <= to) {
            length = to - fromx;
            for (i = 0; i < length; i = i + 1) {
                a[fromx + i] = value;
            }

            success = true;
        } else {
            success = false;
        }

        return success;
    }


    function FillStringRange(a: string[], value: string, fromx: number, to: number): boolean {
        var i: number, length: number;
        var success: boolean;

        if (fromx >= 0 && fromx <= a.length && to >= 0 && to <= a.length && fromx <= to) {
            length = to - fromx;
            for (i = 0; i < length; i = i + 1) {
                a[fromx + i] = value;
            }

            success = true;
        } else {
            success = false;
        }

        return success;
    }


    function CopyNumberArray(a: number[]): number[] {
        var i: number;
        var n: number[];

        n = [];

        for (i = 0; i < a.length; i = i + 1) {
            n[i] = a[i];
        }

        return n;
    }


    function CopyBooleanArray(a: boolean[]): boolean[] {
        var i: number;
        var n: boolean[];

        n = [];

        for (i = 0; i < a.length; i = i + 1) {
            n[i] = a[i];
        }

        return n;
    }


    function CopyString(a: string[]): string[] {
        var i: number;
        var n: string[];

        n = [];

        for (i = 0; i < a.length; i = i + 1) {
            n[i] = a[i];
        }

        return n;
    }


    function CopyNumberArrayRange(a: number[], fromx: number, to: number, copyReference: NumberArrayReference): boolean {
        var i: number, length: number;
        var n: number[];
        var success: boolean;

        if (fromx >= 0 && fromx <= a.length && to >= 0 && to <= a.length && fromx <= to) {
            length = to - fromx;
            n = [];

            for (i = 0; i < length; i = i + 1) {
                n[i] = a[fromx + i];
            }

            copyReference.numberArray = n;
            success = true;
        } else {
            success = false;
        }

        return success;
    }


    function CopyBooleanArrayRange(a: boolean[], fromx: number, to: number, copyReference: BooleanArrayReference): boolean {
        var i: number, length: number;
        var n: boolean[];
        var success: boolean;

        if (fromx >= 0 && fromx <= a.length && to >= 0 && to <= a.length && fromx <= to) {
            length = to - fromx;
            n = [];

            for (i = 0; i < length; i = i + 1) {
                n[i] = a[fromx + i];
            }

            copyReference.booleanArray = n;
            success = true;
        } else {
            success = false;
        }

        return success;
    }


    function CopyStringRange(a: string[], fromx: number, to: number, copyReference: StringReference): boolean {
        var i: number, length: number;
        var n: string[];
        var success: boolean;

        if (fromx >= 0 && fromx <= a.length && to >= 0 && to <= a.length && fromx <= to) {
            length = to - fromx;
            n = [];

            for (i = 0; i < length; i = i + 1) {
                n[i] = a[fromx + i];
            }

            copyReference.stringx = n;
            success = true;
        } else {
            success = false;
        }

        return success;
    }


    function IsLastElement(length: number, index: number): boolean {
        return index + 1 == length;
    }


    function CreateNumberArray(length: number, value: number): number[] {
        var array: number[];

        array = [];
        FillNumberArray(array, value);

        return array;
    }


    function CreateBooleanArray(length: number, value: boolean): boolean[] {
        var array: boolean[];

        array = [];
        FillBooleanArray(array, value);

        return array;
    }


    function CreateString(length: number, value: string): string[] {
        var array: string[];

        array = [];
        FillString(array, value);

        return array;
    }


    function SwapElementsOfArray(A: number[], ai: number, bi: number): void {
        var tmp: number;

        tmp = A[ai];
        A[ai] = A[bi];
        A[bi] = tmp;
    }


    function charToLowerCase(character: string): string {
        var toReturn: string;

        toReturn = character;
        if (character == 'A') {
            toReturn = 'a';
        } else if (character == 'B') {
            toReturn = 'b';
        } else if (character == 'C') {
            toReturn = 'c';
        } else if (character == 'D') {
            toReturn = 'd';
        } else if (character == 'E') {
            toReturn = 'e';
        } else if (character == 'F') {
            toReturn = 'f';
        } else if (character == 'G') {
            toReturn = 'g';
        } else if (character == 'H') {
            toReturn = 'h';
        } else if (character == 'I') {
            toReturn = 'i';
        } else if (character == 'J') {
            toReturn = 'j';
        } else if (character == 'K') {
            toReturn = 'k';
        } else if (character == 'L') {
            toReturn = 'l';
        } else if (character == 'M') {
            toReturn = 'm';
        } else if (character == 'N') {
            toReturn = 'n';
        } else if (character == 'O') {
            toReturn = 'o';
        } else if (character == 'P') {
            toReturn = 'p';
        } else if (character == 'Q') {
            toReturn = 'q';
        } else if (character == 'R') {
            toReturn = 'r';
        } else if (character == 'S') {
            toReturn = 's';
        } else if (character == 'T') {
            toReturn = 't';
        } else if (character == 'U') {
            toReturn = 'u';
        } else if (character == 'V') {
            toReturn = 'v';
        } else if (character == 'W') {
            toReturn = 'w';
        } else if (character == 'X') {
            toReturn = 'x';
        } else if (character == 'Y') {
            toReturn = 'y';
        } else if (character == 'Z') {
            toReturn = 'z';
        }

        return toReturn;
    }


    function charToUpperCase(character: string): string {
        var toReturn: string;

        toReturn = character;
        if (character == 'a') {
            toReturn = 'A';
        } else if (character == 'b') {
            toReturn = 'B';
        } else if (character == 'c') {
            toReturn = 'C';
        } else if (character == 'd') {
            toReturn = 'D';
        } else if (character == 'e') {
            toReturn = 'E';
        } else if (character == 'f') {
            toReturn = 'F';
        } else if (character == 'g') {
            toReturn = 'G';
        } else if (character == 'h') {
            toReturn = 'H';
        } else if (character == 'i') {
            toReturn = 'I';
        } else if (character == 'j') {
            toReturn = 'J';
        } else if (character == 'k') {
            toReturn = 'K';
        } else if (character == 'l') {
            toReturn = 'L';
        } else if (character == 'm') {
            toReturn = 'M';
        } else if (character == 'n') {
            toReturn = 'N';
        } else if (character == 'o') {
            toReturn = 'O';
        } else if (character == 'p') {
            toReturn = 'P';
        } else if (character == 'q') {
            toReturn = 'Q';
        } else if (character == 'r') {
            toReturn = 'R';
        } else if (character == 's') {
            toReturn = 'S';
        } else if (character == 't') {
            toReturn = 'T';
        } else if (character == 'u') {
            toReturn = 'U';
        } else if (character == 'v') {
            toReturn = 'V';
        } else if (character == 'w') {
            toReturn = 'W';
        } else if (character == 'x') {
            toReturn = 'X';
        } else if (character == 'y') {
            toReturn = 'Y';
        } else if (character == 'z') {
            toReturn = 'Z';
        }

        return toReturn;
    }


    function charIsUpperCase(character: string): boolean {
        var isUpper: boolean;

        isUpper = false;
        if (character == 'A') {
            isUpper = true;
        } else if (character == 'B') {
            isUpper = true;
        } else if (character == 'C') {
            isUpper = true;
        } else if (character == 'D') {
            isUpper = true;
        } else if (character == 'E') {
            isUpper = true;
        } else if (character == 'F') {
            isUpper = true;
        } else if (character == 'G') {
            isUpper = true;
        } else if (character == 'H') {
            isUpper = true;
        } else if (character == 'I') {
            isUpper = true;
        } else if (character == 'J') {
            isUpper = true;
        } else if (character == 'K') {
            isUpper = true;
        } else if (character == 'L') {
            isUpper = true;
        } else if (character == 'M') {
            isUpper = true;
        } else if (character == 'N') {
            isUpper = true;
        } else if (character == 'O') {
            isUpper = true;
        } else if (character == 'P') {
            isUpper = true;
        } else if (character == 'Q') {
            isUpper = true;
        } else if (character == 'R') {
            isUpper = true;
        } else if (character == 'S') {
            isUpper = true;
        } else if (character == 'T') {
            isUpper = true;
        } else if (character == 'U') {
            isUpper = true;
        } else if (character == 'V') {
            isUpper = true;
        } else if (character == 'W') {
            isUpper = true;
        } else if (character == 'X') {
            isUpper = true;
        } else if (character == 'Y') {
            isUpper = true;
        } else if (character == 'Z') {
            isUpper = true;
        }

        return isUpper;
    }


    function charIsLowerCase(character: string): boolean {
        var isLower: boolean;

        isLower = false;
        if (character == 'a') {
            isLower = true;
        } else if (character == 'b') {
            isLower = true;
        } else if (character == 'c') {
            isLower = true;
        } else if (character == 'd') {
            isLower = true;
        } else if (character == 'e') {
            isLower = true;
        } else if (character == 'f') {
            isLower = true;
        } else if (character == 'g') {
            isLower = true;
        } else if (character == 'h') {
            isLower = true;
        } else if (character == 'i') {
            isLower = true;
        } else if (character == 'j') {
            isLower = true;
        } else if (character == 'k') {
            isLower = true;
        } else if (character == 'l') {
            isLower = true;
        } else if (character == 'm') {
            isLower = true;
        } else if (character == 'n') {
            isLower = true;
        } else if (character == 'o') {
            isLower = true;
        } else if (character == 'p') {
            isLower = true;
        } else if (character == 'q') {
            isLower = true;
        } else if (character == 'r') {
            isLower = true;
        } else if (character == 's') {
            isLower = true;
        } else if (character == 't') {
            isLower = true;
        } else if (character == 'u') {
            isLower = true;
        } else if (character == 'v') {
            isLower = true;
        } else if (character == 'w') {
            isLower = true;
        } else if (character == 'x') {
            isLower = true;
        } else if (character == 'y') {
            isLower = true;
        } else if (character == 'z') {
            isLower = true;
        }

        return isLower;
    }


    function charIsLetter(character: string): boolean {
        return charIsUpperCase(character) || charIsLowerCase(character);
    }


    function charIsNumber(character: string): boolean {
        var isNumberx: boolean;

        isNumberx = false;
        if (character == '0') {
            isNumberx = true;
        } else if (character == '1') {
            isNumberx = true;
        } else if (character == '2') {
            isNumberx = true;
        } else if (character == '3') {
            isNumberx = true;
        } else if (character == '4') {
            isNumberx = true;
        } else if (character == '5') {
            isNumberx = true;
        } else if (character == '6') {
            isNumberx = true;
        } else if (character == '7') {
            isNumberx = true;
        } else if (character == '8') {
            isNumberx = true;
        } else if (character == '9') {
            isNumberx = true;
        }

        return isNumberx;
    }


    function charIsWhiteSpace(character: string): boolean {
        var isWhiteSpacex: boolean;

        isWhiteSpacex = false;
        if (character == ' ') {
            isWhiteSpacex = true;
        } else if (character == '\t') {
            isWhiteSpacex = true;
        } else if (character == '\n') {
            isWhiteSpacex = true;
        } else if (character == '\r') {
            isWhiteSpacex = true;
        }

        return isWhiteSpacex;
    }


    function charIsSymbol(character: string): boolean {
        var isSymbolx: boolean;

        isSymbolx = false;
        if (character == '!') {
            isSymbolx = true;
        } else if (character == '\"') {
            isSymbolx = true;
        } else if (character == '#') {
            isSymbolx = true;
        } else if (character == '$') {
            isSymbolx = true;
        } else if (character == '%') {
            isSymbolx = true;
        } else if (character == '&') {
            isSymbolx = true;
        } else if (character == '\'') {
            isSymbolx = true;
        } else if (character == '(') {
            isSymbolx = true;
        } else if (character == ')') {
            isSymbolx = true;
        } else if (character == '*') {
            isSymbolx = true;
        } else if (character == '+') {
            isSymbolx = true;
        } else if (character == ',') {
            isSymbolx = true;
        } else if (character == '-') {
            isSymbolx = true;
        } else if (character == '.') {
            isSymbolx = true;
        } else if (character == '/') {
            isSymbolx = true;
        } else if (character == ':') {
            isSymbolx = true;
        } else if (character == ';') {
            isSymbolx = true;
        } else if (character == '<') {
            isSymbolx = true;
        } else if (character == '=') {
            isSymbolx = true;
        } else if (character == '>') {
            isSymbolx = true;
        } else if (character == '?') {
            isSymbolx = true;
        } else if (character == '@') {
            isSymbolx = true;
        } else if (character == '[') {
            isSymbolx = true;
        } else if (character == '\\') {
            isSymbolx = true;
        } else if (character == ']') {
            isSymbolx = true;
        } else if (character == '^') {
            isSymbolx = true;
        } else if (character == '_') {
            isSymbolx = true;
        } else if (character == '`') {
            isSymbolx = true;
        } else if (character == '{') {
            isSymbolx = true;
        } else if (character == '|') {
            isSymbolx = true;
        } else if (character == '}') {
            isSymbolx = true;
        } else if (character == '~') {
            isSymbolx = true;
        }

        return isSymbolx;
    }


    function AssertFalse(b: boolean, failures: NumberReference): void {
        if (b) {
            failures.numberValue = failures.numberValue + 1;
        }
    }


    function AssertTrue(b: boolean, failures: NumberReference): void {
        if (!b) {
            failures.numberValue = failures.numberValue + 1;
        }
    }


    function AssertEquals(a: number, b: number, failures: NumberReference): void {
        if (a != b) {
            failures.numberValue = failures.numberValue + 1;
        }
    }


    function AssertBooleansEqual(a: boolean, b: boolean, failures: NumberReference): void {
        if (a != b) {
            failures.numberValue = failures.numberValue + 1;
        }
    }


    function AssertCharactersEqual(a: string, b: string, failures: NumberReference): void {
        if (a != b) {
            failures.numberValue = failures.numberValue + 1;
        }
    }


    function AssertStringEquals(a: string[], b: string[], failures: NumberReference): void {
        if (!StringsEqual(a, b)) {
            failures.numberValue = failures.numberValue + 1;
        }
    }


    function AssertNumberArraysEqual(a: number[], b: number[], failures: NumberReference): void {
        var i: number;

        if (a.length == b.length) {
            for (i = 0; i < a.length; i = i + 1) {
                AssertEquals(a[i], b[i], failures);
            }
        } else {
            failures.numberValue = failures.numberValue + 1;
        }
    }


    function AssertBooleanArraysEqual(a: boolean[], b: boolean[], failures: NumberReference): void {
        var i: number;

        if (a.length == b.length) {
            for (i = 0; i < a.length; i = i + 1) {
                AssertBooleansEqual(a[i], b[i], failures);
            }
        } else {
            failures.numberValue = failures.numberValue + 1;
        }
    }


    function AssertStringArraysEqual(a: StringReference[], b: StringReference[], failures: NumberReference): void {
        var i: number;

        if (a.length == b.length) {
            for (i = 0; i < a.length; i = i + 1) {
                AssertStringEquals(a[i].stringx, b[i].stringx, failures);
            }
        } else {
            failures.numberValue = failures.numberValue + 1;
        }
    }


    function SubstringWithCheck(stringx: string[], fromx: number, to: number, stringReference: StringReference): boolean {
        var success: boolean;
        if (fromx < stringx.length && to < stringx.length && fromx <= to && fromx >= 0 && to >= 0) {
            stringReference.stringx = Substring(stringx, fromx, to);
            success = true;
        } else {
            success = false;
        }

        return success;
    }


    function Substring(stringx: string[], fromx: number, to: number): string[] {
        var n: string[];
        var i: number;
        n = [];

        for (i = fromx; i < to; i = i + 1) {
            n[i - fromx] = stringx[i];
        }

        return n;
    }


    function AppendString(stringx: string[], s: string[]): string[] {
        var newString: string[];
        newString = ConcatenateString(stringx, s);

        stringx = undefined;

        return newString;
    }


    function ConcatenateString(stringx: string[], s: string[]): string[] {
        var newString: string[];
        var i: number;
        newString = [];

        for (i = 0; i < stringx.length; i = i + 1) {
            newString[i] = stringx[i];
        }

        for (i = 0; i < s.length; i = i + 1) {
            newString[stringx.length + i] = s[i];
        }

        return newString;
    }


    function AppendCharacter(stringx: string[], c: string): string[] {
        var newString: string[];
        newString = ConcatenateCharacter(stringx, c);

        stringx = undefined;

        return newString;
    }


    function ConcatenateCharacter(stringx: string[], c: string): string[] {
        var newString: string[];
        var i: number;
        newString = [];

        for (i = 0; i < stringx.length; i = i + 1) {
            newString[i] = stringx[i];
        }

        newString[stringx.length] = c;

        return newString;
    }


    function SplitByCharacter(toSplit: string[], splitBy: string): StringReference[] {
        var split: StringReference[];
        var stringToSplitBy: string[];
        stringToSplitBy = [];
        stringToSplitBy[0] = splitBy;

        split = SplitByString(toSplit, stringToSplitBy);

        stringToSplitBy = undefined;

        return split;
    }


    function IndexOfCharacter(stringx: string[], character: string, indexReference: NumberReference): boolean {
        var i: number;
        var found: boolean;
        found = false;
        for (i = 0; i < stringx.length && !found; i = i + 1) {
            if (stringx[i] == character) {
                found = true;
                indexReference.numberValue = i;
            }
        }

        return found;
    }


    function SubstringEqualsWithCheck(stringx: string[], fromx: number, substring: string[], equalsReference: BooleanReference): boolean {
        var success: boolean;
        if (fromx < stringx.length) {
            success = true;
            equalsReference.booleanValue = SubstringEquals(stringx, fromx, substring);
        } else {
            success = false;
        }

        return success;
    }


    function SubstringEquals(stringx: string[], fromx: number, substring: string[]): boolean {
        var i: number;
        var equal: boolean;
        equal = true;
        for (i = 0; i < substring.length && equal; i = i + 1) {
            if (stringx[fromx + i] != substring[i]) {
                equal = false;
            }
        }

        return equal;
    }


    function IndexOfString(stringx: string[], substring: string[], indexReference: NumberReference): boolean {
        var i: number;
        var found: boolean;
        found = false;
        for (i = 0; i < stringx.length - substring.length + 1 && !found; i = i + 1) {
            if (SubstringEquals(stringx, i, substring)) {
                found = true;
                indexReference.numberValue = i;
            }
        }

        return found;
    }


    function ContainsCharacter(stringx: string[], character: string): boolean {
        return IndexOfCharacter(stringx, character, new NumberReference());
    }


    function ContainsString(stringx: string[], substring: string[]): boolean {
        return IndexOfString(stringx, substring, new NumberReference());
    }


    function ToUpperCase(stringx: string[]): void {
        var i: number;
        for (i = 0; i < stringx.length; i = i + 1) {
            stringx[i] = cToUpperCase(stringx[i]);
        }
    }


    function ToLowerCase(stringx: string[]): void {
        var i: number;
        for (i = 0; i < stringx.length; i = i + 1) {
            stringx[i] = cToLowerCase(stringx[i]);
        }
    }


    function EqualsIgnoreCase(a: string[], b: string[]): boolean {
        var equal: boolean;
        var i: number;
        if (a.length == b.length) {
            equal = true;
            for (i = 0; i < a.length && equal; i = i + 1) {
                if (cToLowerCase(a[i]) != cToLowerCase(b[i])) {
                    equal = false;
                }
            }
        } else {
            equal = false;
        }

        return equal;
    }


    function ReplacesString(stringx: string[], toReplace: string[], replaceWith: string[]): string[] {
        var result: string[];
        var i: number;
        var equalsReference: BooleanReference;
        var success: boolean;
        equalsReference = new BooleanReference();
        result = [];

        for (i = 0; i < stringx.length;) {
            success = SubstringEqualsWithCheck(stringx, i, toReplace, equalsReference);
            if (success) {
                success = equalsReference.booleanValue;
            }
            if (success && toReplace.length > 0) {
                result = ConcatenateString(result, replaceWith);
                i = i + toReplace.length;
            } else {
                result = ConcatenateCharacter(result, stringx[i]);
                i = i + 1;
            }
        }

        return result;
    }


    function ReplaceCharacter(stringx: string[], toReplace: string, replaceWith: string): string[] {
        var result: string[];
        var i: number;
        result = [];

        for (i = 0; i < stringx.length; i = i + 1) {
            if (stringx[i] == toReplace) {
                result = ConcatenateCharacter(result, replaceWith);
            } else {
                result = ConcatenateCharacter(result, stringx[i]);
            }
        }

        return result;
    }


    function Trim(stringx: string[]): string[] {
        var result: string[];
        var i: number, lastWhitespaceLocationStart: number, lastWhitespaceLocationEnd: number;
        var firstNonWhitespaceFound: boolean;
        lastWhitespaceLocationStart = -1;
        firstNonWhitespaceFound = false;
        for (i = 0; i < stringx.length && !firstNonWhitespaceFound; i = i + 1) {
            if (cIsWhiteSpace(stringx[i])) {
                lastWhitespaceLocationStart = i;
            } else {
                firstNonWhitespaceFound = true;
            }
        }

        /* Find whitepaces at the end.*/
        lastWhitespaceLocationEnd = stringx.length;
        firstNonWhitespaceFound = false;
        for (i = stringx.length - 1; i >= 0 && !firstNonWhitespaceFound; i = i - 1) {
            if (cIsWhiteSpace(stringx[i])) {
                lastWhitespaceLocationEnd = i;
            } else {
                firstNonWhitespaceFound = true;
            }
        }

        if (lastWhitespaceLocationStart < lastWhitespaceLocationEnd) {
            result = Substring(stringx, lastWhitespaceLocationStart + 1, lastWhitespaceLocationEnd);
        } else {
            result = [];
        }

        return result;
    }


    function StartsWith(stringx: string[], start: string[]): boolean {
        var startsWithString: boolean;
        startsWithString = false;
        if (stringx.length >= start.length) {
            startsWithString = SubstringEquals(stringx, 0, start);
        }

        return startsWithString;
    }


    function EndsWith(stringx: string[], end: string[]): boolean {
        var endsWithString: boolean;
        endsWithString = false;
        if (stringx.length >= end.length) {
            endsWithString = SubstringEquals(stringx, stringx.length - end.length, end);
        }

        return endsWithString;
    }


    function SplitByString(toSplit: string[], splitBy: string[]): StringReference[] {
        var split: StringReference[];
        var next: string[];
        var i: number;
        var c: string;
        var n: StringReference;
        split = [];

        next = [];
        for (i = 0; i < toSplit.length;) {
            c = toSplit[i];
            if (SubstringEquals(toSplit, i, splitBy)) {
                if (split.length != 0 || i != 0) {
                    n = new StringReference();
                    n.stringx = next;
                    split = lAddString(split, n);
                    next = [];
                    i = i + splitBy.length;
                }
            } else {
                next = AppendCharacter(next, c);
                i = i + 1;
            }
        }

        if (next.length > 0) {
            n = new StringReference();
            n.stringx = next;
            split = lAddString(split, n);
        }

        return split;
    }


    function lAddNumber(list: number[], a: number): number[] {
        var newlist: number[];
        var i: number;
        newlist = [];
        for (i = 0; i < list.length; i = i + 1) {
            newlist[i] = list[i];
        }
        newlist[list.length] = a;

        list = undefined;

        return newlist;
    }


    function lAddNumberRef(list: NumberArrayReference, i: number): void {
        list.numberArray = lAddNumber(list.numberArray, i);
    }


    function lRemoveNumber(list: number[], n: number): number[] {
        var newlist: number[];
        var i: number;
        newlist = [];

        for (i = 0; i < list.length; i = i + 1) {
            if (i < n) {
                newlist[i] = list[i];
            }
            if (i > n) {
                newlist[i - 1] = list[i];
            }
        }

        list = undefined;

        return newlist;
    }


    function lGetNumberRef(list: NumberArrayReference, i: number): number {
        return list.numberArray[i];
    }


    function lRemoveNumberRef(list: NumberArrayReference, i: number): void {
        list.numberArray = lRemoveNumber(list.numberArray, i);
    }


    function lAddString(list: StringReference[], a: StringReference): StringReference[] {
        var newlist: StringReference[];
        var i: number;
        newlist = [];

        for (i = 0; i < list.length; i = i + 1) {
            newlist[i] = list[i];
        }
        newlist[list.length] = a;

        list = undefined;

        return newlist;
    }


    function lAddStringRef(list: StringArrayReference, i: StringReference): void {
        list.stringArray = lAddString(list.stringArray, i);
    }


    function lRemoveString(list: StringReference[], n: number): StringReference[] {
        var newlist: StringReference[];
        var i: number;
        newlist = [];

        for (i = 0; i < list.length; i = i + 1) {
            if (i < n) {
                newlist[i] = list[i];
            }
            if (i > n) {
                newlist[i - 1] = list[i];
            }
        }

        list = undefined;

        return newlist;
    }


    function lGetStringRef(list: StringArrayReference, i: number): StringReference {
        return list.stringArray[i];
    }


    function lRemoveStringRef(list: StringArrayReference, i: number): void {
        list.stringArray = lRemoveString(list.stringArray, i);
    }


    function lAddBoolean(list: boolean[], a: boolean): boolean[] {
        var newlist: boolean[];
        var i: number;
        newlist = [];
        for (i = 0; i < list.length; i = i + 1) {
            newlist[i] = list[i];
        }
        newlist[list.length] = a;

        list = undefined;

        return newlist;
    }


    function lAddBooleanRef(list: BooleanArrayReference, i: boolean): void {
        list.booleanArray = lAddBoolean(list.booleanArray, i);
    }


    function lRemoveBoolean(list: boolean[], n: number): boolean[] {
        var newlist: boolean[];
        var i: number;
        newlist = [];

        for (i = 0; i < list.length; i = i + 1) {
            if (i < n) {
                newlist[i] = list[i];
            }
            if (i > n) {
                newlist[i - 1] = list[i];
            }
        }

        list = undefined;

        return newlist;
    }


    function lGetBooleanRef(list: BooleanArrayReference, i: number): boolean {
        return list.booleanArray[i];
    }


    function lRemoveDecimalRef(list: BooleanArrayReference, i: number): void {
        list.booleanArray = lRemoveBoolean(list.booleanArray, i);
    }


    function lAddCharacter(list: string[], a: string): string[] {
        var newlist: string[];
        var i: number;
        newlist = [];
        for (i = 0; i < list.length; i = i + 1) {
            newlist[i] = list[i];
        }
        newlist[list.length] = a;

        list = undefined;

        return newlist;
    }


    function lAddCharacterRef(list: StringReference, i: string): void {
        list.stringx = lAddCharacter(list.stringx, i);
    }


    function lRemoveCharacter(list: string[], n: number): string[] {
        var newlist: string[];
        var i: number;
        newlist = [];

        for (i = 0; i < list.length; i = i + 1) {
            if (i < n) {
                newlist[i] = list[i];
            }
            if (i > n) {
                newlist[i - 1] = list[i];
            }
        }

        list = undefined;

        return newlist;
    }


    function lGetCharacterRef(list: StringReference, i: number): string {
        return list.stringx[i];
    }


    function lRemoveCharacterRef(list: StringReference, i: number): void {
        list.stringx = lRemoveCharacter(list.stringx, i);
    }


    function arraysStringToNumberArray(stringx: string[]): number[] {
        var i: number;
        var array: number[];
        array = [];

        for (i = 0; i < stringx.length; i = i + 1) {
            array[i] = stringx[i].charCodeAt(0);
        }
        return array;
    }


    function arraysNumberArrayToString(array: number[]): string[] {
        var i: number;
        var stringx: string[];
        stringx = [];

        for (i = 0; i < array.length; i = i + 1) {
            stringx[i] = String.fromCharCode(array[i]);
        }
        return stringx;
    }


    function arraysNumberArraysEqual(a: number[], b: number[]): boolean {
        var equal: boolean;
        var i: number;
        equal = true;
        if (a.length == b.length) {
            for (i = 0; i < a.length && equal; i = i + 1) {
                if (a[i] != b[i]) {
                    equal = false;
                }
            }
        } else {
            equal = false;
        }

        return equal;
    }


    function arraysBooleanArraysEqual(a: boolean[], b: boolean[]): boolean {
        var equal: boolean;
        var i: number;
        equal = true;
        if (a.length == b.length) {
            for (i = 0; i < a.length && equal; i = i + 1) {
                if (a[i] != b[i]) {
                    equal = false;
                }
            }
        } else {
            equal = false;
        }

        return equal;
    }


    function arraysStringsEqual(a: string[], b: string[]): boolean {
        var equal: boolean;
        var i: number;
        equal = true;
        if (a.length == b.length) {
            for (i = 0; i < a.length && equal; i = i + 1) {
                if (a[i] != b[i]) {
                    equal = false;
                }
            }
        } else {
            equal = false;
        }

        return equal;
    }


    function arraysFillNumberArray(a: number[], value: number): void {
        var i: number;
        for (i = 0; i < a.length; i = i + 1) {
            a[i] = value;
        }
    }


    function arraysFillString(a: string[], value: string): void {
        var i: number;
        for (i = 0; i < a.length; i = i + 1) {
            a[i] = value;
        }
    }


    function arraysFillBooleanArray(a: boolean[], value: boolean): void {
        var i: number;
        for (i = 0; i < a.length; i = i + 1) {
            a[i] = value;
        }
    }


    function arraysFillNumberArrayInterval(a: number[], value: number, fromx: number, to: number): boolean {
        var i: number;
        var success: boolean;
        if (fromx >= 0 && fromx < a.length && to >= 0 && to < a.length) {
            for (i = fromx; i < to; i = i + 1) {
                a[i] = value;
            }
            success = true;
        } else {
            success = false;
        }

        return success;
    }


    function arraysFillBooleanArrayInterval(a: boolean[], value: boolean, fromx: number, to: number): boolean {
        var i: number;
        var success: boolean;
        if (fromx >= 0 && fromx < a.length && to >= 0 && to < a.length) {
            for (i = Math.max(fromx, 0); i < Math.min(to, a.length); i = i + 1) {
                a[i] = value;
            }
            success = true;
        } else {
            success = false;
        }

        return success;
    }


    function arraysFillStringInterval(a: string[], value: string, fromx: number, to: number): boolean {
        var i: number;
        var success: boolean;
        if (fromx >= 0 && fromx < a.length && to >= 0 && to < a.length) {
            for (i = Math.max(fromx, 0); i < Math.min(to, a.length); i = i + 1) {
                a[i] = value;
            }
            success = true;
        } else {
            success = false;
        }

        return success;
    }


    function arraysCopyNumberArray(a: number[]): number[] {
        var i: number;
        var n: number[];
        n = [];

        for (i = 0; i < a.length; i = i + 1) {
            n[i] = a[i];
        }

        return n;
    }


    function arraysCopyBooleanArray(a: boolean[]): boolean[] {
        var i: number;
        var n: boolean[];
        n = [];

        for (i = 0; i < a.length; i = i + 1) {
            n[i] = a[i];
        }

        return n;
    }


    function arraysCopyString(a: string[]): string[] {
        var i: number;
        var n: string[];
        n = [];

        for (i = 0; i < a.length; i = i + 1) {
            n[i] = a[i];
        }

        return n;
    }


    function arraysCopyNumberArrayRange(a: number[], fromx: number, to: number, copyReference: NumberArrayReference): boolean {
        var i: number, length: number;
        var n: number[];
        var success: boolean;
        if (fromx >= 0 && fromx < a.length && to >= 0 && to < a.length && fromx <= to) {
            length = to - fromx;
            n = [];
            for (i = 0; i < length; i = i + 1) {
                n[i] = a[fromx + i];
            }
            copyReference.numberArray = n;
            success = true;
        } else {
            success = false;
        }

        return success;
    }


    function arraysCopyBooleanArrayRange(a: boolean[], fromx: number, to: number, copyReference: BooleanArrayReference): boolean {
        var i: number, length: number;
        var n: boolean[];
        var success: boolean;
        if (fromx >= 0 && fromx < a.length && to >= 0 && to < a.length && fromx <= to) {
            length = to - fromx;
            n = [];
            for (i = 0; i < length; i = i + 1) {
                n[i] = a[fromx + i];
            }
            copyReference.booleanArray = n;
            success = true;
        } else {
            success = false;
        }

        return success;
    }


    function arraysCopyStringRange(a: string[], fromx: number, to: number, copyReference: StringReference): boolean {
        var i: number, length: number;
        var n: string[];
        var success: boolean;
        if (fromx >= 0 && fromx < a.length && to >= 0 && to < a.length && fromx <= to) {
            length = to - fromx;
            n = [];
            for (i = 0; i < length; i = i + 1) {
                n[i] = a[fromx + i];
            }
            copyReference.stringx = n;
            success = true;
        } else {
            success = false;
        }

        return success;
    }


    function arraysIsLastElement(length: number, index: number): boolean {
        return index + 1 == length;
    }


    function arraysCreateNumberArray(length: number, value: number): number[] {
        var array: number[];
        array = [];
        arraysFillNumberArray(array, value);

        return array;
    }


    function arraysCreateBooleanArray(length: number, value: boolean): boolean[] {
        var array: boolean[];
        array = [];
        arraysFillBooleanArray(array, value);

        return array;
    }


    function arraysCreateString(length: number, value: string): string[] {
        var array: string[];
        array = [];
        arraysFillString(array, value);

        return array;
    }


    function cToLowerCase(character: string): string {
        var toReturn: string;
        toReturn = character;
        if (character == 'A') {
            toReturn = 'a';
        } else if (character == 'B') {
            toReturn = 'b';
        } else if (character == 'C') {
            toReturn = 'c';
        } else if (character == 'D') {
            toReturn = 'd';
        } else if (character == 'E') {
            toReturn = 'e';
        } else if (character == 'F') {
            toReturn = 'f';
        } else if (character == 'G') {
            toReturn = 'g';
        } else if (character == 'H') {
            toReturn = 'h';
        } else if (character == 'I') {
            toReturn = 'i';
        } else if (character == 'J') {
            toReturn = 'j';
        } else if (character == 'K') {
            toReturn = 'k';
        } else if (character == 'L') {
            toReturn = 'l';
        } else if (character == 'M') {
            toReturn = 'm';
        } else if (character == 'N') {
            toReturn = 'n';
        } else if (character == 'O') {
            toReturn = 'o';
        } else if (character == 'P') {
            toReturn = 'p';
        } else if (character == 'Q') {
            toReturn = 'q';
        } else if (character == 'R') {
            toReturn = 'r';
        } else if (character == 'S') {
            toReturn = 's';
        } else if (character == 'T') {
            toReturn = 't';
        } else if (character == 'U') {
            toReturn = 'u';
        } else if (character == 'V') {
            toReturn = 'v';
        } else if (character == 'W') {
            toReturn = 'w';
        } else if (character == 'X') {
            toReturn = 'x';
        } else if (character == 'Y') {
            toReturn = 'y';
        } else if (character == 'Z') {
            toReturn = 'z';
        }

        return toReturn;
    }


    function cToUpperCase(character: string): string {
        var toReturn: string;
        toReturn = character;
        if (character == 'a') {
            toReturn = 'A';
        } else if (character == 'b') {
            toReturn = 'B';
        } else if (character == 'c') {
            toReturn = 'C';
        } else if (character == 'd') {
            toReturn = 'D';
        } else if (character == 'e') {
            toReturn = 'E';
        } else if (character == 'f') {
            toReturn = 'F';
        } else if (character == 'g') {
            toReturn = 'G';
        } else if (character == 'h') {
            toReturn = 'H';
        } else if (character == 'i') {
            toReturn = 'I';
        } else if (character == 'j') {
            toReturn = 'J';
        } else if (character == 'k') {
            toReturn = 'K';
        } else if (character == 'l') {
            toReturn = 'L';
        } else if (character == 'm') {
            toReturn = 'M';
        } else if (character == 'n') {
            toReturn = 'N';
        } else if (character == 'o') {
            toReturn = 'O';
        } else if (character == 'p') {
            toReturn = 'P';
        } else if (character == 'q') {
            toReturn = 'Q';
        } else if (character == 'r') {
            toReturn = 'R';
        } else if (character == 's') {
            toReturn = 'S';
        } else if (character == 't') {
            toReturn = 'T';
        } else if (character == 'u') {
            toReturn = 'U';
        } else if (character == 'v') {
            toReturn = 'V';
        } else if (character == 'w') {
            toReturn = 'W';
        } else if (character == 'x') {
            toReturn = 'X';
        } else if (character == 'y') {
            toReturn = 'Y';
        } else if (character == 'z') {
            toReturn = 'Z';
        }

        return toReturn;
    }


    function cIsUpperCase(character: string): boolean {
        var isUpper: boolean;
        isUpper = false;
        if (character == 'A') {
            isUpper = true;
        } else if (character == 'B') {
            isUpper = true;
        } else if (character == 'C') {
            isUpper = true;
        } else if (character == 'D') {
            isUpper = true;
        } else if (character == 'E') {
            isUpper = true;
        } else if (character == 'F') {
            isUpper = true;
        } else if (character == 'G') {
            isUpper = true;
        } else if (character == 'H') {
            isUpper = true;
        } else if (character == 'I') {
            isUpper = true;
        } else if (character == 'J') {
            isUpper = true;
        } else if (character == 'K') {
            isUpper = true;
        } else if (character == 'L') {
            isUpper = true;
        } else if (character == 'M') {
            isUpper = true;
        } else if (character == 'N') {
            isUpper = true;
        } else if (character == 'O') {
            isUpper = true;
        } else if (character == 'P') {
            isUpper = true;
        } else if (character == 'Q') {
            isUpper = true;
        } else if (character == 'R') {
            isUpper = true;
        } else if (character == 'S') {
            isUpper = true;
        } else if (character == 'T') {
            isUpper = true;
        } else if (character == 'U') {
            isUpper = true;
        } else if (character == 'V') {
            isUpper = true;
        } else if (character == 'W') {
            isUpper = true;
        } else if (character == 'X') {
            isUpper = true;
        } else if (character == 'Y') {
            isUpper = true;
        } else if (character == 'Z') {
            isUpper = true;
        }

        return isUpper;
    }


    function cIsLowerCase(character: string): boolean {
        var isLower: boolean;
        isLower = false;
        if (character == 'a') {
            isLower = true;
        } else if (character == 'b') {
            isLower = true;
        } else if (character == 'c') {
            isLower = true;
        } else if (character == 'd') {
            isLower = true;
        } else if (character == 'e') {
            isLower = true;
        } else if (character == 'f') {
            isLower = true;
        } else if (character == 'g') {
            isLower = true;
        } else if (character == 'h') {
            isLower = true;
        } else if (character == 'i') {
            isLower = true;
        } else if (character == 'j') {
            isLower = true;
        } else if (character == 'k') {
            isLower = true;
        } else if (character == 'l') {
            isLower = true;
        } else if (character == 'm') {
            isLower = true;
        } else if (character == 'n') {
            isLower = true;
        } else if (character == 'o') {
            isLower = true;
        } else if (character == 'p') {
            isLower = true;
        } else if (character == 'q') {
            isLower = true;
        } else if (character == 'r') {
            isLower = true;
        } else if (character == 's') {
            isLower = true;
        } else if (character == 't') {
            isLower = true;
        } else if (character == 'u') {
            isLower = true;
        } else if (character == 'v') {
            isLower = true;
        } else if (character == 'w') {
            isLower = true;
        } else if (character == 'x') {
            isLower = true;
        } else if (character == 'y') {
            isLower = true;
        } else if (character == 'z') {
            isLower = true;
        }

        return isLower;
    }


    function cIsLetter(character: string): boolean {
        return cIsUpperCase(character) || cIsLowerCase(character);
    }


    function cIsNumber(character: string): boolean {
        var isNumber: boolean;
        isNumber = false;
        if (character == '0') {
            isNumber = true;
        } else if (character == '1') {
            isNumber = true;
        } else if (character == '2') {
            isNumber = true;
        } else if (character == '3') {
            isNumber = true;
        } else if (character == '4') {
            isNumber = true;
        } else if (character == '5') {
            isNumber = true;
        } else if (character == '6') {
            isNumber = true;
        } else if (character == '7') {
            isNumber = true;
        } else if (character == '8') {
            isNumber = true;
        } else if (character == '9') {
            isNumber = true;
        }

        return isNumber;
    }


    function cIsWhiteSpace(character: string): boolean {
        var isWhiteSpace: boolean;
        isWhiteSpace = false;
        if (character == ' ') {
            isWhiteSpace = true;
        } else if (character == '\t') {
            isWhiteSpace = true;
        } else if (character == '\n') {
            isWhiteSpace = true;
        } else if (character == '\r') {
            isWhiteSpace = true;
        }

        return isWhiteSpace;
    }


    function cIsSymbol(character: string): boolean {
        var isSymbol: boolean;
        isSymbol = false;
        if (character == '!') {
            isSymbol = true;
        } else if (character == '\"') {
            isSymbol = true;
        } else if (character == '#') {
            isSymbol = true;
        } else if (character == '$') {
            isSymbol = true;
        } else if (character == '%') {
            isSymbol = true;
        } else if (character == '&') {
            isSymbol = true;
        } else if (character == '\'') {
            isSymbol = true;
        } else if (character == '(') {
            isSymbol = true;
        } else if (character == ')') {
            isSymbol = true;
        } else if (character == '*') {
            isSymbol = true;
        } else if (character == '+') {
            isSymbol = true;
        } else if (character == ',') {
            isSymbol = true;
        } else if (character == '-') {
            isSymbol = true;
        } else if (character == '.') {
            isSymbol = true;
        } else if (character == '/') {
            isSymbol = true;
        } else if (character == ':') {
            isSymbol = true;
        } else if (character == ';') {
            isSymbol = true;
        } else if (character == '<') {
            isSymbol = true;
        } else if (character == '=') {
            isSymbol = true;
        } else if (character == '>') {
            isSymbol = true;
        } else if (character == '?') {
            isSymbol = true;
        } else if (character == '@') {
            isSymbol = true;
        } else if (character == '[') {
            isSymbol = true;
        } else if (character == '\\') {
            isSymbol = true;
        } else if (character == ']') {
            isSymbol = true;
        } else if (character == '^') {
            isSymbol = true;
        } else if (character == '_') {
            isSymbol = true;
        } else if (character == '`') {
            isSymbol = true;
        } else if (character == '{') {
            isSymbol = true;
        } else if (character == '|') {
            isSymbol = true;
        } else if (character == '}') {
            isSymbol = true;
        } else if (character == '~') {
            isSymbol = true;
        }

        return isSymbol;
    }




}