<script>

import { userName } from '../_stores';
import { goto } from '@sapper/app';
$:if($userName)
goto(`profile/${$userName}`)
</script>