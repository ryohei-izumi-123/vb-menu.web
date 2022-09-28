/**
 *
 *
 * @export
 * @class App
 */
export class App {
  /**
   * Creates an instance of App.
   * @param {string} [VERSION = '20.0.7']
   * @memberof App
   */
  constructor(VERSION = '20.0.7') {
    this.config = {
      version: VERSION,
      storeKey: 'VB_PAGE',
      prefix: 'page',
      pages: 13,
    }
    this.state = {
      data: {},
      isSearch: false,
      isBusy: false,
      mode: null,
      page: 0,
      zoom: {
        initial: {
          pageX: 0,
          pageY: 0,
          distance: 0,
        },
      },
      pos: {
        wheel: {
          pos: 0,
          dir: false,
        },
        initial: undefined,
        current: {
          clientX: undefined,
          clientY: undefined,
        },
      },
    }
  }

  /**
   *
   *
   * @readonly
   * @memberof App
   */
  get isMobile() {
    return navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i)
  }

  /**
   *
   * @type {HTMLDivElement}
   * @readonly
   * @memberof App
   */
  get $preloader() {
    return document.querySelector('.preloader-wrapper')
  }

  /**
   *
   * @type {HTMLInputElement}
   * @readonly
   * @memberof App
   */
  get $input() {
    return document.querySelector('input')
  }

  /**
   *
   * @type {HTMLFormElement}
   * @readonly
   * @memberof App
   */
  get $form() {
    return document.querySelector('form')
  }

  /**
   *
   * @type {HTMLDivElement}
   * @readonly
   * @memberof App
   */
  get $overlay() {
    return document.querySelector('.overlay')
  }

  /**
   *
   * @type {HTMLElement}
   * @readonly
   * @memberof App
   */
  get $figure() {
    return document.querySelector('figure')
  }

  /**
   *
   * @type {HTMLElement}
   * @readonly
   * @memberof App
   */
  get $figcaption() {
    return document.querySelector('figcaption')
  }

  /**
   *
   * @type {HTMLImageElement}
   * @readonly
   * @memberof App
   */
  get $img() {
    return document.querySelector('img')
  }

  /**
   *
   * @type {HTMLElement}
   * @readonly
   * @memberof App
   */
  get $main() {
    return document.querySelector('main')
  }

  /**
   *
   * @type {HTMLElement}
   * @readonly
   * @memberof App
   */
  get $close() {
    return document.querySelector('.close')
  }

  /**
   *
   * @type {HTMLElement}
   * @readonly
   * @memberof App
   */
  get $submit() {
    return document.querySelector('.submit')
  }

  /**
   *
   * @type {HTMLButtonElement}
   * @readonly
   * @memberof App
   */
  get $next() {
    return document.querySelector('.next')
  }

  /**
   *
   * @type {HTMLButtonElement}
   * @readonly
   * @memberof App
   */
  get $prev() {
    return document.querySelector('.prev')
  }

  /**
   *
   * @type {HTMLButtonElement}
   * @readonly
   * @memberof App
   */
  get $search() {
    return document.querySelector('.search')
  }

  /**
   *
   * @type {HTMLButtonElement}
   * @readonly
   * @memberof App
   */
  get $zoom() {
    return document.querySelector('.zoom')
  }

  /**
   *
   * @type {HTMLButtonElement}
   * @readonly
   * @memberof App
   */
  get $share() {
    return document.querySelector('.share')
  }

  /**
   *
   * @type {HTMLButtonElement}
   * @readonly
   * @memberof App
   */
  get $refresh() {
    return document.querySelector('.refresh')
  }

  /**
   *
   * @type {HTMLElement}
   * @readonly
   * @memberof App
   */
  get $header() {
    return document.querySelector('header')
  }

  /**
   *
   * @type {HTMLElement}
   * @readonly
   * @memberof App
   */
  get $footer() {
    return document.querySelector('footer')
  }

  /**
   *
   * @type {HTMLUListElement}
   * @readonly
   * @memberof App
   */
  get $list() {
    return document.getElementById('list')
  }

  /**
   *
   *
   * @param {number} [no=0]
   * @return {string}
   * @memberof App
   */
  getId(no = 0) {
    return `${this.config.prefix}${no}`
  }

  /**
   *
   *
   * @param {number} [no=0]
   * @return {string}
   * @memberof App
   */
  getSrc(no = 0) {
    return `/public/img/${this.getId(no)}.jpg`
  }

  /**
   *
   *
   * @return {number}
   * @memberof App
   */
  get startPage() {
    let page = Number(localStorage.getItem(this.config.storeKey))
    if (isNaN(page)) {
      page = 0
    }

    return page
  }

  /**
   *
   *
   * @memberof App
   */
  init() {
    this.$footer.innerText = `v${this.config.version}`
    this.goTo(this.startPage)
    this.registerEventListeners()
    this.resetForm()
    this.fetchData()
      .then(this.setData.bind(this))
      .catch(e => console.error(e))
  }

  /**
   *
   *
   * @param {Object} data
   * @memberof App
   */
  setData(data) {
    this.state.data = data
    Object.values(this.state.data).map(values =>
      values.map(value => {
        const $li = document.createElement('li')
        $li.innerText = value
        $li.addEventListener('click', this.onSelect.bind(this))
        this.$list.appendChild($li)
      })
    )
  }

  /**
   *
   *
   * @param {boolean} [flg=true]
   * @memberof App
   */
  togglePreloader(flg = true) {
    this.$preloader.style.display = flg ? 'flex' : 'none'
  }

  /**
   *
   *
   * @param {MouseEvent} e
   * @memberof App
   */
  onSelect(e) {
    e.stopPropagation()
    const { innerText = '' } = e.target
    const clazz = 'active'
    Array.from(this.$list.childNodes).map($li => $li.classList.remove(clazz))
    this.$input.value = innerText
    this.$input.blur()
    this.$submit.click()
  }

  /**
   *
   *
   * @return {Object}
   * @memberof App
   */
  async fetchData() {
    const options = {
      method: 'GET',
      mode: 'same-origin',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    }
    const response = await fetch('/data.json', options)
    return response.json()
  }

  /**
   *
   *
   * @memberof App
   */
  next() {
    if (this.state.page === this.config.pages - 1) {
      return
    }

    this.goTo(this.state.page + 1)
  }

  /**
   *
   *
   * @memberof App
   */
  prev() {
    if (this.state.page === 0) {
      return
    }

    this.goTo(this.state.page - 1)
  }

  /**
   *
   *
   * @param {MouseEvent} e
   * @memberof App
   */
  // eslint-disable-next-line
  toggleOverlay(e) {
    this.resetForm()
    this.state.isSearch = !this.state.isSearch
    this.$overlay.style.display = this.state.isSearch ? 'flex' : 'none'
    if (this.state.isSearch) {
      this.$input.focus()
    }
  }

  /**
   *
   *
   * @memberof App
   */
  resetForm() {
    this.$form.reset()
    this.setInputError(false)
  }

  /**
   *
   *
   * @param {HTMLButtonElement} $button
   * @param {boolean} [isVisible=false]
   * @memberof App
   */
  toggleButton($button, isVisible = false) {
    const display = isVisible ? 'inline-block' : 'none'
    $button.style.display = display
  }

  /**
   *
   *
   * @param {number} [no=0]
   * @return {Promise<boolean>}
   * @memberof App
   */
  loadImage(no = 0) {
    return new Promise((resolve, reject) => {
      const src = this.getSrc(no)
      const onload = () => resolve(true)
      const onerror = e => reject(e)
      this.togglePreloader(true)
      this.$img.onload = onload
      this.$img.onerror = onerror
      this.$img.setAttribute('src', src)
    })
  }

  /**
   *
   *
   * @param {number} [no=0]
   * @memberof App
   */
  goTo(no = 0) {
    const resolve = () => {
      localStorage.setItem(this.config.storeKey, no)
      this.state.page = no
      this.$figcaption.innerText = `${no + 1}`
      this.togglePreloader(false)
      this.toggleButton(this.$next, true)
      this.toggleButton(this.$prev, true)
      switch (this.state.page) {
        case 0:
          this.toggleButton(this.$prev, false)
          break

        case this.config.pages - 1:
          this.toggleButton(this.$next, false)
          break

        default:
          break
      }
    }

    this.loadImage(no)
      .then(() => resolve())
      .catch(e => console.error(e))
  }

  /**
   *
   * @memberof App
   */
  registerEventListeners() {
    this.$next.addEventListener('click', this.next.bind(this))
    this.$prev.addEventListener('click', this.prev.bind(this))
    this.$search.addEventListener('click', this.toggleOverlay.bind(this))
    this.$overlay.addEventListener('click', this.toggleOverlay.bind(this), false)
    this.$close.addEventListener('click', this.resetForm.bind(this))
    this.$zoom.addEventListener('click', this.zoom.bind(this))

    if (this.isMobile) {
      this.$main.addEventListener('touchstart', this.onTouchStart.bind(this), false)
      this.$main.addEventListener('touchmove', this.onTouchMove.bind(this), false)
      this.$main.addEventListener('touchend', this.onTouchEnd.bind(this), false)
    } else {
      this.$main.addEventListener('wheel', this.onWheel.bind(this))
    }

    this.$input.addEventListener('input', this.onInput.bind(this))
    if (this.isMobile) {
      // TODO:
      // this.$input.addEventListener('keypress', this.onInput.bind(this))
    }

    this.$submit.addEventListener('click', this.onSubmit.bind(this))
    this.$form.addEventListener('submit', this.onSubmit.bind(this))
    this.$form.addEventListener('click', this.onFormClick.bind(this))

    // share for mobile
    if ('share' in navigator) {
      this.$share.style.display = 'inline-block'
      this.$share.addEventListener('click', this.share.bind(this))
    }

    // TODO:
    // refresh for serviceWorker
    if ('serviceWorker' in navigator) {
      // this.$refresh.style.display = 'inline-block'
      // this.$refresh.addEventListener('click', this.refresh.bind(this))
    }

    // work as standalone app
    if (window.matchMedia('(display-mode: standalone)').matches) {
      document.addEventListener('visibilitychange', this.onVisibilityChange.bind(this))
    }

    window.addEventListener('error', this.onError.bind(this))
  }

  /**
   *
   *
   * @param {Event} e
   * @memberof App
   */
  onFormClick(e) {
    e.stopPropagation()
  }

  /**
   *
   *
   * @param {string} message
   * @param {string} source
   * @param {number} lineno
   * @param {number} colno
   * @param {Error} error
   * @memberof App
   */
  onError(message, source, lineno, colno, error) {
    console.error(`Error raised: ${message} at ${source}@${lineno}:${colno}`, error)
  }

  /**
   *
   *
   * @param {Event} e
   * @memberof App
   */
  // eslint-disable-next-line
  share(e) {
    const data = {
      title: 'Vorpal Bunny 餐酒館 菜單',
      text: '臺北市中山區林森北路85巷49號 02-2567-0015',
      url: location.href,
    }

    return navigator
      .share(data)
      .then(res => console.log(res))
      .catch(e => console.error(e))
  }

  /**
   *
   *
   * @param {Event} e
   * @memberof App
   */
  // eslint-disable-next-line
  refresh(e) {
    navigator.serviceWorker
      .getRegistration()
      .then(registration => {
        if (registration && registration.waiting !== null) {
          registration
            .unregister()
            .then(() => window.location.reload())
            .catch(e => console.error(e))
        }
      })
      .catch(e => console.error(e))
  }

  /**
   *
   *
   * @param {Event} e
   * @memberof App
   */
  // eslint-disable-next-line
  onVisibilityChange(e) {
    if (document.visibilityState === 'hidden') {
      // TODO:
    }
  }

  /**
   *
   *
   * @param {Event} e
   * @memberof App
   */
  // eslint-disable-next-line
  onInput(e) {
    this.$input.setCustomValidity('')
    const { value = '' } = this.$input
    const clazz = 'active'
    const $nodes = Array.from(this.$list.childNodes)
    $nodes.map($li => {
      const match = value && String($li.innerText).includes(value)
      match ? $li.classList.add(clazz) : $li.classList.remove(clazz)
    })
  }

  /**
   *
   *
   * @param {boolean} [hasError=true]
   * @memberof App
   */
  setInputError(hasError = true) {
    const error = hasError ? 'Oops! not found...' : ''
    const color = hasError ? 'red' : 'white'
    const icon = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${color}'><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/></svg>")`
    this.$input.setCustomValidity(error)
    this.$form.style.setProperty('--validate-color', color)
    this.$form.style.setProperty('--close-icon', icon)
  }

  /**
   *
   *
   * @param {string} [word='']
   * @return {number}
   * @memberof App
   */
  findByWord(word = '') {
    let page
    word = String(word).toLowerCase()
    for (const [key = '', values = []] of Object.entries(this.state.data)) {
      // exact match
      if (values.includes(word)) {
        page = Number(key)
        break
      }

      if (values.some(value => value.includes(word))) {
        page = Number(key)
        break
      }
    }

    return page
  }

  /**
   *
   *
   * @param {SubmitEvent} e
   * @memberof App
   */
  // eslint-disable-next-line
  onSubmit(e) {
    e.preventDefault()
    const { value = '' } = this.$input
    if (value.length === 0) {
      return
    }

    const found = this.findByWord(value)
    const hasError = typeof found !== 'number'
    this.setInputError(hasError)
    if (!hasError) {
      this.toggleOverlay(e)
      this.goTo(found)
    }
  }

  /**
   *
   *
   * @param {number} [scale=1]
   * @memberof App
   */
  transformImage(scale = 1) {
    const transform = `scale(${scale})`
    this.$img.style.transform = transform
    this.$img.style.WebkitTransform = transform
  }

  /**
   *
   * @param {MouseEvent} e
   * @memberof App
   */
  zoom() {
    let scale = 1
    const prefix = 'fa-search-'
    const plus = `${prefix}plus`
    const minus = `${prefix}minus`
    const $icon = this.$zoom.firstChild
    const clazz = Array.from($icon.classList).find(c => c.includes(prefix))
    switch (clazz) {
      case plus:
        scale = 1.25
        $icon.classList.replace(plus, minus)
        break
      default:
      case minus:
        $icon.classList.replace(minus, plus)
        break
    }

    this.transformImage(scale)
  }

  /**
   *
   *
   * @param {Touch} a
   * @param {Touch} b
   * @return {Touch}
   * @memberof App
   */
  computePos(a, b) {
    const clientX = a.clientX - b.clientX
    const clientY = a.clientY - b.clientY

    return {
      clientX,
      clientY,
    }
  }

  /**
   *
   *
   * @param {TouchEvent} e
   * @memberof App
   */
  getDistance(e) {
    const { touches } = e
    if (touches.length == 2) {
      const [$0, $1] = touches
      return Math.hypot($0.pageX - $1.pageX, $0.pageY - $1.pageY)
    }

    return 1
  }

  /**
   *
   *
   * @param {TouchEvent} e
   * @memberof App
   */
  onTouchEnd(e) {
    e.preventDefault()
    const isZoom = e.touches.length == 2
    if (isZoom) {
      this.transformImage()
    }

    this.state.mode = null
  }

  /**
   *
   *
   * @param {TouchEvent} e
   * @memberof App
   */
  onTouchMove(e) {
    e.preventDefault()
    // TODO: e.changedTouches.length === 2 || e.targetTouches.length === 2
    const { touches } = e
    const [$0] = touches
    const isZoom = touches.length == 2
    if (isZoom) {
      if (this.state.mode !== 'zoom') {
        return
      }

      const max = 4
      const z = 'scale' in e ? e.scale : this.getDistance(e) / this.state.zoom.initial.distance
      let scale = Math.min(Math.max(1, z), max)
      if (scale > max) {
        scale = max
      }

      // const pageX = (($0.pageX + $1.pageX) / 2 - this.state.zoom.initial.pageX) * 2
      // const pageY = (($0.pageY + $1.pageY) / 2 - this.state.zoom.initial.pageY) * 2
      // const transform = `translate3d(${pageX}px, ${pageY}px, 0) scale(${scale})`
      this.transformImage(scale)
    } else {
      if (!this.state.pos.initial) {
        return
      }

      if (this.state.mode !== 'scroll') {
        return
      }

      this.state.pos.current = $0
      const { initial, current } = this.state.pos
      const { clientX, clientY } = this.computePos(initial, current)
      if (Math.abs(clientX) > Math.abs(clientY)) {
        return
      }

      const gap = Math.abs(clientY)
      if (gap < 5) {
        return
      }

      clientY > 0 ? this.next() : this.prev()
      this.state.pos.initial = undefined
    }
  }

  /**
   *
   *
   * @param {TouchEvent} e
   * @memberof App
   */
  onTouchStart(e) {
    e.preventDefault()
    const [$0, $1] = e.touches
    const isZoom = e.touches.length === 2
    if (isZoom) {
      this.state.mode = 'zoom'
      this.state.zoom.initial.pageX = ($0.pageX + $1.pageX) / 2
      this.state.zoom.initial.pageY = ($0.pageY + $1.pageY) / 2
      this.state.zoom.initial.distance = this.getDistance(e)
    } else {
      this.state.mode = 'scroll'
      this.state.pos.initial = $0
    }
  }

  /**
   *
   *
   * @param {WheelEvent} e
   * @memberof App
   */
  onWheel(e) {
    const { deltaY = 0 } = e
    this.state.pos.wheel.pos = deltaY
    this.state.pos.wheel.dir = deltaY > 0
    if (this.state.isBusy) {
      return
    }

    this.state.isBusy = true
    window.requestAnimationFrame(() => {
      const { pos, dir } = this.state.pos.wheel
      if (Math.abs(pos) > 0) {
        dir ? this.next() : this.prev()
      }

      window.setTimeout(() => (this.state.isBusy = false), 1000)
    })
  }
}
