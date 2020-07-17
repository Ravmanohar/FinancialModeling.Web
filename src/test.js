(hv > thd 
? "-" 
: ((phr === 0 && per == 0) 
? 0 
: ((phr == 0 && per > 0 && hv < pherb) 
? 0 
: ((phr == 0 && per > 0 && hv >= pherb && ((hv - pherb + 1) * per <= pdm || pdm == 0)) 
? (hv - pherb + 1) * per 
: (((hv < pherb || per == 0) && (pchv + phr <= pdm || pdm == 0)) 
? pchv + phr 
: ((hv >= pherb && (pchv + phr + (hv - pherb + 1) * per <= pdm || pdm == 0)) 
? pchv + phr + (hv - pherb + 1) * per 
: pdm))))))