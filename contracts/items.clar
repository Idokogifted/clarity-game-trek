;; NFT implementation for items
(define-non-fungible-token game-item uint)

;; Item types
(define-data-var next-item-id uint u1)

;; Item attributes
(define-map item-attributes uint
  {
    item-type: (string-ascii 32),
    power: uint,
    level-req: uint
  }
)

;; Item ownership check
(define-read-only (owns-item (item-id uint))
  (is-eq (some tx-sender) (nft-get-owner? game-item item-id))
)

;; Mint new item
(define-public (mint-item (item-type (string-ascii 32)) (power uint) (level-req uint))
  (let
    (
      (item-id (var-get next-item-id))
    )
    (try! (nft-mint? game-item item-id tx-sender))
    (map-set item-attributes item-id
      {
        item-type: item-type,
        power: power,
        level-req: level-req
      }
    )
    (var-set next-item-id (+ item-id u1))
    (ok item-id)
  )
)

;; Get item attributes
(define-read-only (get-item-attributes (item-id uint))
  (ok (map-get? item-attributes item-id))
)
