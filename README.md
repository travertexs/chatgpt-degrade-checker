# ChatGPT Service Downgrade Detection Tool

This tool helps detect if ChatGPT has limited access to certain features on your account by downgrading service due to a "high-risk" IP designation. Users encountering issues like the inability to generate images with GPT-4, limited web search access, or simplified responses from GPT-3.5 may benefit from running this script to identify potential downgrades.

## Installation and Usage
1. First, install Tampermonkey: https://www.tampermonkey.net/

2. Then, click this link to install the tool: [Click to Install](https://update.greasyfork.org/scripts/516051/ChatGPT%E9%99%8D%E7%BA%A7%E6%A3%80%E6%B5%8B.user.js)

3. After installation, open [ChatGPT](https://chatgpt.com/). A green circle will appear on the right side of the screen. Hover over it to view diagnostic details. If the Proof of Work (PoW) difficulty displayed is unusually low, it may suggest that your IP has been flagged, which could result in limited access to certain features.

   As a reference, PoW values with five or more digits generally indicate an unrestricted IP that should allow full access to ChatGPT’s capabilities. Values of 000032 or lower could indicate that the IP is considered high-risk, leading to restricted functionality.

   _(Note: PoW levels can vary even for the same IP. For example, after completing a higher difficulty PoW, the next one may be slightly easier, although it typically won’t drop to “simple.”)_

## What Is a Service Downgrade?
When certain IPs are flagged as high-risk, ChatGPT may silently downgrade access by switching to a lower-tier model, such as the 4o-mini variant or a simpler model, without notifying the user.

### Effects of Service Downgrades
With service downgrades, even ChatGPT Plus users may notice missing features like web search and image generation on GPT-4. Similarly, if downgraded to a lighter GPT-3.5 model, responses may become more basic, with less depth in reasoning. 

For users experiencing sudden changes in ChatGPT functionality—like missing image generation, web search, or nuanced responses—this tool may help clarify if a silent downgrade is impacting their experience.


---

# ChatGPT 服务降级检测工具
由于 ChatGPT 会对某些 ip 进行无提示的服务降级，此脚本用于检测你的 ip 是否被 ChatGPT 判定为高风险。在一定程度上可以用于辅助判断你的 ip 是否遭到服务降级。

## 安装及使用
1. 首先安装 tampermonkey：https://www.tampermonkey.net/

2. 然后点击链接安装本工具： [点此安装](https://update.greasyfork.org/scripts/516051/ChatGPT%E9%99%8D%E7%BA%A7%E6%A3%80%E6%B5%8B.user.js)

3. 安装完成后打开 [chatgpt](https://chatgpt.com/)，你可以在屏幕右侧看到一个绿色圆圈，鼠标移上去之后会显示详细信息，如果 PoW 难度的值很低，代表你的 ip 可能被判断为了高风险。

作为参考，这个值在超过 5 位时，一般代表你的ip较为优质，可以正常使用所有服务，如果小于等于 000032，说明你的 ip 被认为有很高的风险。

（更详细的区分尚不清晰，我简单测试了几个 ip，发现即便对同一个 ip，其要求的 PoW 也很容易变动，例如，如果已经完成了一个较困难的 PoW，下一次的 PoW 难度就会稍稍降低，但不会降低到“简单”级别。）

## 什么是服务降级？
ChatGPT 会对一些被判断为高风险的 ip 降级服务，偷偷将模型切换为 4o-mini 或者更差，并且**没有任何提示**。

### 服务降级有什么影响
降级后，即便你是 plus 用户，在使用 4o 模型时会发现无法使用联网搜索、图片生成等功能，使用 o1 模型时，会发现模型不进行思考直接回答。


---

# Outil de Détection de Baisse de Service ChatGPT
Cet outil aide à détecter si ChatGPT a limité l'accès à certaines fonctionnalités de votre compte en raison d'une désignation d'IP "à haut risque". Les utilisateurs rencontrant des problèmes tels que l'incapacité de générer des images avec GPT-4, un accès limité à la recherche web ou des réponses simplifiées de GPT-3.5 peuvent bénéficier de ce script pour identifier d'éventuelles baisses de service.

## Installation et Utilisation
Installez d'abord Tampermonkey : https://www.tampermonkey.net/

Ensuite, cliquez sur ce lien pour installer l'outil : Cliquez pour Installer

Après l'installation, ouvrez ChatGPT. Un cercle vert apparaîtra sur le côté droit de l'écran. Survolez-le pour afficher les détails du diagnostic. Si la difficulté de la Preuve de Travail (PoW) affichée est exceptionnellement basse, cela peut suggérer que votre IP a été signalée, ce qui pourrait entraîner un accès limité à certaines fonctionnalités.

À titre de référence, des valeurs PoW avec cinq chiffres ou plus indiquent généralement une IP non restreinte qui devrait permettre un accès complet aux fonctionnalités de ChatGPT. Des valeurs de 000032 ou moins peuvent indiquer que l'IP est considérée comme à haut risque, ce qui conduit à une fonctionnalité restreinte.

(Remarque : les niveaux PoW peuvent varier même pour la même IP. Par exemple, après avoir terminé une PoW difficile, la suivante peut être légèrement plus facile, bien qu'elle ne descende généralement pas au niveau "simple".)

## Qu'est-ce qu'une Baisse de Service ?
Lorsque certaines IP sont signalées comme à haut risque, ChatGPT peut réduire silencieusement l'accès en basculant vers un modèle de niveau inférieur, comme la variante 4o-mini ou un modèle plus simple, sans en informer l'utilisateur.

### Effets de la Baisse de Service
Avec une baisse de service, même les utilisateurs ChatGPT Plus peuvent remarquer des fonctionnalités manquantes, telles que la recherche web et la génération d'images sur GPT-4. De même, si l'accès est réduit à un modèle plus léger GPT-3.5, les réponses peuvent devenir plus basiques, avec moins de profondeur dans le raisonnement.

Pour les utilisateurs constatant des changements soudains dans les fonctionnalités de ChatGPT—comme l'absence de génération d'images, de recherche web, ou des réponses moins nuancées—cet outil peut aider à clarifier si une baisse de service silencieuse affecte leur expérience.