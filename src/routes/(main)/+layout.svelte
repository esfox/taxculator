<script lang="ts">
  import { page } from '$app/stores';
  import clsx from 'clsx';

  const navigationLinks = [
    {
      label: 'Tax',
      icon: 'fa fa-file-invoice',
      link: '/',
    },
    {
      label: 'Income',
      icon: 'fa fa-money-bills',
      link: '/income',
    },
  ];
</script>

<div class="h-full grid grid-rows-[1fr_auto]">
  <slot />
  <nav class="btm-nav relative">
    {#each navigationLinks as navigationLink}
      <a
        href={navigationLink.link}
        class={clsx($page.url.pathname === navigationLink.link && 'active text-accent')}
      >
        <i class={navigationLink.icon}></i>
        <span class="btm-nav-label">{navigationLink.label}</span>
      </a>
    {/each}
  </nav>
</div>
