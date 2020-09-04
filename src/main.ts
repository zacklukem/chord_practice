const NOTES = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];

enum SeventhType {
  Major = 'maj7',
  Minor = '7',
}

enum ChordType {
  Major = '',
  Minor = 'm',
  Dim = 'dim',
}

interface Options {
  keySignature: string;
  scale: ScaleType;
  seventh: boolean;
}

interface Scale {
  intervals: number[],
  chordTypes: ChordType[],
  seventhType: SeventhType[],
}

enum ScaleType {
  Major = "MAJOR",
}

function getScale(scale: ScaleType): Scale {
  switch (scale) {
    case ScaleType.Major:
      return {
        intervals: [0, 2, 2, 1, 2, 2, 2],
        chordTypes: [ChordType.Major, ChordType.Minor, ChordType.Minor,
          ChordType.Major, ChordType.Major, ChordType.Minor, ChordType.Dim],
        seventhType: [SeventhType.Major, SeventhType.Minor, SeventhType.Minor,
          SeventhType.Major, SeventhType.Minor, SeventhType.Minor, SeventhType.Minor]
      };
    default:
      return getScale(ScaleType.Major);
  }
}

function getScaleNotes(key: string, scale: Scale): string[] {
  let scaleNotes = [];
  let i = NOTES.indexOf(key);
  for (let interval of scale.intervals) {
    i += interval;
    scaleNotes.push(NOTES[i % NOTES.length]);
  }
  return scaleNotes;
}

let lastChord = "";

function getRandomChord(options: Options): string {
  let scale = getScale(options.scale);
  let scaleNotes = getScaleNotes(options.keySignature, scale);
  let root = Math.floor(Math.random() * (scaleNotes.length));
  let output = `
    <b>${scaleNotes[root].toUpperCase()}</b>
    <small>${scale.chordTypes[root]
      + (options.seventh ? scale.seventhType[root] : '')
    }</small>`;
  if (output === lastChord) {
    return getRandomChord(options);
  } else {
    lastChord = output;
    return output;
  }
}

function main() {
  const chordDisplayElement = document.getElementById("chord_display");
  const keySignatureElement: HTMLSelectElement =
    document.getElementById("key_signature") as HTMLSelectElement;
  const nextButtonElement = document.getElementById("next_chord");
  const showSeventhElement: HTMLInputElement = document.getElementById("show_seventh") as HTMLInputElement;
  const optionsButtonElement = document.getElementById("options_button");
  const optionsPanelElement = document.getElementById("options_panel");

  optionsButtonElement.onclick = () => {
    if (optionsPanelElement.classList.contains("visible")) {
      optionsPanelElement.classList.remove("visible");
    } else {
      optionsPanelElement.classList.add("visible");
    }

  }

  for (let key of NOTES) {
    let option = document.createElement('option');
    option.setAttribute('value', key);
    option.innerHTML = key.toUpperCase();
    keySignatureElement.appendChild(option);
  }

  function generateOptions(): Options {
    return {
      keySignature: keySignatureElement.value,
      scale: ScaleType.Major,
      seventh: showSeventhElement.checked,
    }
  }

  nextButtonElement.onclick = () => {
    let options = generateOptions();
    chordDisplayElement.innerHTML = getRandomChord(options);
  }

}

window.onload = main;
