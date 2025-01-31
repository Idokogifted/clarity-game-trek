;; Character traits
(define-trait character-trait
  (
    (get-stats (uint) (response {health: uint, attack: uint, defense: uint} uint))
    (level-up (uint) (response bool uint))
    (set-equipment (uint) (response bool uint))
  )
)

;; NFT definition for characters
(define-non-fungible-token game-character uint)

;; Data vars
(define-data-var next-character-id uint u1)

;; Character stats map
(define-map character-stats uint 
  {
    health: uint,
    attack: uint,
    defense: uint,
    level: uint,
    experience: uint
  }
)

;; Create new character
(define-public (create-character)
  (let
    (
      (character-id (var-get next-character-id))
    )
    (try! (nft-mint? game-character character-id tx-sender))
    (map-set character-stats character-id
      {
        health: u100,
        attack: u10,
        defense: u10,
        level: u1,
        experience: u0
      }
    )
    (var-set next-character-id (+ character-id u1))
    (ok character-id)
  )
)

;; Get character stats
(define-read-only (get-character-stats (character-id uint))
  (ok (map-get? character-stats character-id))
)
