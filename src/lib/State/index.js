var { generateBlocks } = require("./blocks")
var { Step } = require("./steps")

function processBlock({ journey, subject, situation, isActive }, b) {
  if (b instanceof Step) {
    b.isActive = isActive
    journey.push(b)
  } else if (typeof b == "string") {
    console.warn(`string step should no longer be used: ${b}`)
    journey.push({ isActive, path: b })
  } else {
    if (!b.steps) {
      throw Error("" + b + " (" + (b instanceof Array ? "array" : "?") + ")")
    }
    let blockSubject = b.subject
      ? b.subject(subject, situation)
      : subject || situation
    const localActive =
      isActive &&
      (!b.isActive || (blockSubject && b.isActive(blockSubject, situation)))
    b.steps.forEach((s) =>
      processBlock(
        { journey, subject: blockSubject, situation, isActive: localActive },
        s
      )
    )
  }
}

function generateJourney(situation) {
  const blocks = generateBlocks(situation)

  function processBlocks({ situation }) {
    let journey = []
    blocks.forEach((b) => {
      processBlock(
        { journey, subject: situation, situation, isActive: true },
        b
      )
    })
    return journey
  }
  try {
    return processBlocks({ situation })
  } catch (e) {
    console.log("error", e)
  }
}

function full(situation) {
  const journey = generateJourney(situation)
  journey.pop()
  let lastChapter
  return journey.map((s) => {
    if (s.chapter) lastChapter = s.chapter
    else s.chapter = lastChapter
    return s
  })
}

function current(currentPath, situation) {
  const journey = full(situation)
  return journey.find((item) => item.path == currentPath)
}

function next(current, situation) {
  const journey = full(situation)
  const activeJourney = journey.filter((s) => s.isActive)

  let matches = activeJourney
    .map((element, index) => {
      return { element, index }
    })
    .filter((item) => item.element.path == (current.path || current))
  if (matches.length) {
    return activeJourney[matches[matches.length - 1].index + 1]
  } else {
    const test = current.path || current.fullPath || current
    throw new Error("Logic missing for " + test)
  }
}

module.exports = {
  full,
  next,
  current,
}
