<script>
  import { base } from '$app/paths';
  import { createEventDispatcher } from 'svelte';
  export let dict;
  export let acrossFills;
  export let downFills;
  export let cellFills;
  export let cellFillLen;

  const suggestedWordLimit = 100;
  const dispatch = createEventDispatcher();

  const highlightEntry = ({entry, pivotIdx}) => {
    const wordStart = pivotIdx * cellFillLen;
    const wordEnd = wordStart + cellFillLen;
    const front = entry.word.slice(0, wordStart);
    const pivot = entry.word.slice(wordStart, wordEnd);
    const back = entry.word.slice(wordEnd);
    return `${front}<strong>${pivot}</strong>${back}`;
  };
</script>

<div id="cell-data">
  {#if dict}
    <ul>
      <li>{acrossFills?.length ?? "?"} potential across fills.
        {#if acrossFills}
          <div class="word-grid">
            {#each acrossFills.slice(0, suggestedWordLimit) as entry}
              <a on:click={() => dispatch('fillAcross', {
                  word: entry.entry.word,
                  pivotIdx: entry.pivotIdx,
                })}
                on:mouseover={() => dispatch('previewAcross', {
                  word: entry.entry.word,
                  pivotIdx: entry.pivotIdx,
                })}
                on:mouseout={() => dispatch('clearPreview')}
              >
                {@html highlightEntry(entry)}
              </a>
            {/each}
          </div>
        {/if}
      </li>
      <li>{downFills?.length ?? "?"} potential down fills.
        {#if downFills}
          <div class="word-grid">
            {#each downFills.slice(0, suggestedWordLimit) as entry}
              <a on:click={() => dispatch('fillDown', {
                  word: entry.entry.word,
                  pivotIdx: entry.pivotIdx,
                })}
                on:mouseover={() => dispatch('previewDown', {
                  word: entry.entry.word,
                  pivotIdx: entry.pivotIdx,
                })}
                on:mouseout={() => dispatch('clearPreview')}
              >
                {@html highlightEntry(entry)}
              </a>
            {/each}
          </div>
        {/if}
      </li>
      <li>{cellFills?.length ?? "?"} potential fills for this cell:
        {#if cellFills}
          <div class="letter-grid">
            {#each cellFills as fill}
              <a
                on:click={() => dispatch('fillCell', { fill })}
                on:mouseover={() => dispatch('previewCell', { fill })}
                on:mouseout={() => dispatch('clearPreview')}
              >{fill}</a>
            {/each}
          </div>
        {/if}
      </li>
    </ul>
  {:else}
    <div class="spinner-container">
      <img class="spinner" src="{base}/spinner.gif" alt="loading fill suggestions" />
    </div>
  {/if}
</div>

<style>
  .spinner-container {
    text-align: center;
  }

  img.spinner {
    width: 99px;
    image-rendering: pixelated;
  }

  #cell-data {
    background-color: lightyellow;
    font-family: Arial;
  }

  .word-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .word-grid > * {
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 10px;
  }

  .letter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(2em, 1fr));
  }

  a {
    cursor: pointer;
  }
</style>
