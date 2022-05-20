{
    import { DLMEcop, DLMEpop, DLMEbiprop, DLMEnegprop, DLMEprop } from "./App.js";
}

start
    = x:cop { return x; }
    / l:cop '&' r:cop { return new DLMEcop(l, r); }

cop
    = _ "(" left:cop '&' right:cop ")" _ { return new DLMEcop(left, right); }
    / _ o:op c:cprop _ { return new DLMEpop(o, c); }
    / _ '(' x:cop ')' _ { return x; }

op
    = '!' { return 0; }
    / '?' { return 1; }
    / '+d' { return 3; }
    / '+r' { return 4; }
    / '+' { return 2; }

cprop
    = _ '(' left:cprop '&' right:cprop ')' _ { return new DLMEbiprop(left, right); }
    / _ '~' p:cprop _ { return new DLMEnegprop(p); } 
    / _ /*'p_' */digits:[0-9]+ _ { return parseInt(digits.join(''), 10)-1; }
    / _ '(' x: cprop ')' _ {return x;}

_
    = [ ]*