import React, { useCallback, useEffect, useRef, useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

/* O original do Magento mora no mesmo caminho sem o segmento /cache/<hash>/,
   e durante um tempo subimos pra ele achando que a versão em cache era uma
   miniatura de 300x300. Não é: medindo as duas, dá 1200x1200 nas duas: o que
   muda é a compressão, 60 KB contra 111 KB. Ou seja, trocávamos 1,8x de peso
   por pixel nenhum, em ~50 fotos de uma vez na home. Agora quem sobe pro
   original é só quem tem tela pra isso, com `fullSize`. */
const upgrade = (src: string) => src.replace(/\/cache\/[a-f0-9]{32}\//, '/')

/* Toda URL que já pintou uma vez nesta aba. Serve pra decidir se o esqueleto
   deve nascer: o mesmo produto aparece em vitrine, busca e PDP, e piscar um
   bloco cinza a cada volta é pior do que não ter esqueleto nenhum. O cache do
   browser resolve o download; esta lista resolve a aparência. */
const jaPintou = new Set<string>()

export interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Busca o original do Magento em vez da miniatura. Só para PDP e zoom. */
  fullSize?: boolean
  /** Desliga o esqueleto (ícone pequeno, logo, bandeira de cartão). */
  semEsqueleto?: boolean
  /** Esqueleto em creme, para imagem sobre fundo escuro. */
  esqueletoEscuro?: boolean
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)
  const {
    src,
    alt,
    style,
    className,
    fullSize,
    semEsqueleto,
    esqueletoEscuro,
    onLoad,
    decoding = 'async',
    ...rest
  } = props
  const resolver = useCallback(
    (s: typeof src) => (typeof s === 'string' && fullSize ? upgrade(s) : s),
    [fullSize],
  )
  const [current, setCurrent] = useState(() => resolver(src))
  const [pronta, setPronta] = useState(
    () => semEsqueleto || (typeof current === 'string' && jaPintou.has(current)),
  )
  const imgRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const proxima = resolver(src)
    setDidError(false)
    setCurrent(proxima)
    setPronta(
      semEsqueleto || (typeof proxima === 'string' && jaPintou.has(proxima)),
    )
  }, [src, resolver, semEsqueleto])

  const marcarPronta = () => {
    if (typeof current === 'string') jaPintou.add(current)
    setPronta(true)
  }

  /* Numa segunda visita a imagem vem do cache do browser e já está completa
     antes do primeiro paint — aí o `onLoad` pode nem disparar. O ref roda
     antes de pintar, então o esqueleto nunca chega a aparecer. */
  const medir = (node: HTMLImageElement | null) => {
    imgRef.current = node
    if (node?.complete && node.naturalWidth > 0) marcarPronta()
  }

  const handleError = () => {
    if (typeof src === 'string' && current !== src) {
      setCurrent(src) // original cheio não existe: volta pra thumb
      return
    }
    setPronta(true) // some o esqueleto: o que vem agora é o ícone de erro
    setDidError(true)
  }

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img
      ref={medir}
      src={current}
      alt={alt}
      decoding={decoding}
      className={`${className ?? ''}${
        pronta ? '' : ` tn-skel${esqueletoEscuro ? ' tn-skel-escuro' : ''}`
      }`}
      /* O card mistura a foto no branco com `multiply` pra sumir com o fundo
         do packshot. Enquanto o esqueleto está no ar não há foto pra misturar,
         e `multiply` apagaria justamente a varredura clara. Blend só depois. */
      style={pronta || !style ? style : { ...style, mixBlendMode: undefined }}
      {...rest}
      onLoad={(e) => {
        marcarPronta()
        onLoad?.(e)
      }}
      onError={handleError}
    />
  )
}
